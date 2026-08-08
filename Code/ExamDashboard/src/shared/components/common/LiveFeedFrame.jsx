import React, { useEffect, useRef } from 'react';
import { Badge } from '../ui/Badge';
import { Camera, Mic, Monitor, Wifi, Clock, Radio } from 'lucide-react';

export function LiveFeedFrame({
  candidate,
  videoRef,
  frameUrl,
  streamUrl,
  allowSnapshotFallback = true,
  title = 'Live Feed',
  subtitle = 'Camera stream remains pinned for the full exam session',
  className = ''
}) {
  const feedUrl = streamUrl || frameUrl || candidate?.liveFeedUrl || (allowSnapshotFallback ? candidate?.snapshotUrl || candidate?.photoUrl : '');
  const status = candidate?.status || 'LIVE';
  const statusVariant = status === 'CRITICAL' ? 'danger' : status === 'WARNING' ? 'warning' : 'success';

  const localVideoRef = useRef(null);

  useEffect(() => {
    // No more local webcam hack here - Invigilator will receive network frames via feedUrl.
  }, [videoRef]);

  return (
    <div className={`relative aspect-video rounded-xl overflow-hidden bg-slate-950 shadow-sm ${className}`}>
      {videoRef ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : feedUrl ? (
        <img
          src={feedUrl}
          alt={candidate?.name ? `${candidate.name} live feed` : 'Live feed'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 bg-slate-950 gap-2">
          <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">Awaiting live video</div>
          <div className="text-sm font-medium text-slate-300">The candidate feed will appear here once the camera relay is active.</div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-3 text-white">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.28em] text-slate-300 font-bold flex items-center gap-2">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            {title}
          </div>
          <div className="mt-1 text-sm font-bold truncate">
            {candidate?.name || 'Candidate'}
          </div>
          <div className="text-[11px] text-slate-300 truncate">
            {subtitle}
          </div>
        </div>
        <Badge variant={statusVariant} size="sm" className="shrink-0">
          {status}
        </Badge>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-white">
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-medium">
          <span className="flex items-center gap-1.5">
            <Camera className={`w-3 h-3 ${candidate?.cameraActive === false ? 'text-red-400' : 'text-emerald-400'}`} />
            Camera
          </span>
          <span className="flex items-center gap-1.5">
            <Mic className={`w-3 h-3 ${candidate?.micActive === false ? 'text-red-400' : 'text-emerald-400'}`} />
            Mic
          </span>
          <span className="flex items-center gap-1.5">
            <Monitor className={`w-3 h-3 ${candidate?.screenShareActive === false ? 'text-red-400' : 'text-emerald-400'}`} />
            Screen
          </span>
          <span className="flex items-center gap-1.5">
            <Wifi className={`w-3 h-3 ${candidate?.internetStatus === 'DISCONNECTED' ? 'text-red-400' : candidate?.internetStatus === 'LAGGING' ? 'text-amber-400' : 'text-emerald-400'}`} />
            {candidate?.internetStatus || 'CONNECTED'}
          </span>
        </div>

        <div className="bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-slate-200 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-indigo-400" />
          {candidate?.heartbeatStatus || 'LIVE'}
        </div>
      </div>
    </div>
  );
}