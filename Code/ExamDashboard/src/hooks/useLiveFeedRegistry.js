import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const LIVE_FEED_CHANNEL = 'exam-live-feeds';
const LIVE_FEED_CACHE_KEY = 'exam-live-feeds-cache';
const BACKEND_URL = 'http://localhost:5001';

export function useLiveFeedRegistry() {
  const [feeds, setFeeds] = useState({});

  useEffect(() => {
    // Connect to Socket.io backend
    const socket = io(BACKEND_URL);

    const loadCachedFeeds = () => {
      try {
        const cachedFeeds = JSON.parse(localStorage.getItem(LIVE_FEED_CACHE_KEY) || '{}');
        setFeeds(cachedFeeds);
      } catch {
        setFeeds({});
      }
    };

    loadCachedFeeds();

    // Pull initial feeds from REST API
    fetch(`${BACKEND_URL}/api/feeds`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data?.items)) {
          const nextFeeds = data.items.reduce((acc, item) => {
            if (item?.candidateId) {
              acc[item.candidateId] = item;
            }
            return acc;
          }, {});
          setFeeds(prev => ({ ...prev, ...nextFeeds }));
        }
      })
      .catch(() => undefined);

    // Listen for live socket feed-update events
    socket.on('feed-update', (payload) => {
      if (payload?.candidateId) {
        setFeeds(prev => ({
          ...prev,
          [payload.candidateId]: payload
        }));
      }
    });

    const channel = new BroadcastChannel(LIVE_FEED_CHANNEL);
    const handleMessage = (event) => {
      const payload = event.data;
      if (!payload?.candidateId) {
        return;
      }
      setFeeds(prev => ({
        ...prev,
        [payload.candidateId]: payload
      }));
    };

    const handleStorage = (event) => {
      if (event.key === LIVE_FEED_CACHE_KEY) {
        loadCachedFeeds();
      }
    };

    channel.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);

    return () => {
      socket.disconnect();
      channel.removeEventListener('message', handleMessage);
      channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return feeds;
}