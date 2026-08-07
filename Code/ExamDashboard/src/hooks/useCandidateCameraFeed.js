import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const LIVE_FEED_CHANNEL = 'exam-live-feeds';
const LIVE_FEED_CACHE_KEY = 'exam-live-feeds-cache';
const BACKEND_URL = 'http://localhost:5001';

export function useCandidateCameraFeed(candidateId, enabled) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const channelRef = useRef(null);
  const intervalRef = useRef(null);
  const socketRef = useRef(null);
  const [frameUrl, setFrameUrl] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    if (!enabled || !candidateId) {
      return undefined;
    }

    let active = true;

    // Connect to Socket.io for lightweight frame transmission
    socketRef.current = io(BACKEND_URL);

    const publishFrame = () => {
      const videoEl = videoRef.current;
      if (!videoEl || videoEl.readyState < 2) {
        return;
      }

      // Draw lightweight 240p frames
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 180;
      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      context.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

      try {
        // High JPEG compression (30% quality) keeps payload under 10KB
        const nextFrameUrl = canvas.toDataURL('image/jpeg', 0.3);
        const payload = {
          candidateId,
          frameUrl: nextFrameUrl,
          timestamp: Date.now(),
          heartbeatStatus: 'LIVE',
          cameraActive: true
        };

        setFrameUrl(nextFrameUrl);

        // Sync with local tabs
        if (channelRef.current) {
          channelRef.current.postMessage(payload);
        }

        // Emit frame via WebSocket instead of heavy HTTP POST
        if (socketRef.current) {
          socketRef.current.emit('candidate-frame', {
            candidateId,
            frameUrl: nextFrameUrl,
            cameraActive: true
          });
        }

        const cachedFeeds = JSON.parse(localStorage.getItem(LIVE_FEED_CACHE_KEY) || '{}');
        cachedFeeds[candidateId] = payload;
        localStorage.setItem(LIVE_FEED_CACHE_KEY, JSON.stringify(cachedFeeds));
      } catch {
        // Ignore capture errors from blocked canvas conversion.
      }
    };

    const startStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 360 }
          },
          audio: false
        });

        if (!active) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => undefined);
        }

        channelRef.current = new BroadcastChannel(LIVE_FEED_CHANNEL);
        setIsReady(true);
        setCameraError('');
        publishFrame();
        intervalRef.current = setInterval(publishFrame, 250);
      } catch (error) {
        if (!active) {
          return;
        }
        setIsReady(false);
        setCameraError(error instanceof Error ? error.message : 'Unable to start camera feed');
      }
    };

    startStream();

    return () => {
      active = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [candidateId, enabled]);

  return {
    videoRef,
    frameUrl,
    isCameraReady: isReady,
    cameraError
  };
}