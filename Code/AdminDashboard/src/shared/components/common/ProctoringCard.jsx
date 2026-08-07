import React from 'react';
import { Camera, Mic, Monitor, AlertTriangle, ShieldCheck, Wifi, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function ProctoringCard({ candidate, onSelect }) {
  const isCritical = candidate.status === 'CRITICAL';
  const isWarning = candidate.status === 'WARNING';
  const isOffline = candidate.status === 'OFFLINE';

  const statusVariant = isCritical ? 'danger' : isWarning ? 'warning' : isOffline ? 'default' : 'success';

  return (
    <div
      onClick={() => onSelect && onSelect(candidate)}
      className={`bg-surface-container-lowest border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer relative group ${
        isCritical ? 'border-red-400 ring-1 ring-red-400' : isWarning ? 'border-yellow-400' : isOffline ? 'border-slate-300 opacity-80' : 'border-outline-variant'
      }`}
    >
      {/* Video stream mockup */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
        <img
          src={candidate.snapshotUrl}
          alt={candidate.name}
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Live HUD Header */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
          <Badge variant={statusVariant} size="sm">
            {candidate.status}
          </Badge>
          <div className="flex gap-1.5 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-white">
            <Camera className={`w-3 h-3 ${candidate.cameraActive ? 'text-emerald-400' : 'text-red-400'}`} title="Camera" />
            <Mic className={`w-3 h-3 ${candidate.micActive ? 'text-emerald-400' : 'text-red-400'}`} title="Microphone" />
            <Monitor className={`w-3 h-3 ${candidate.screenShareActive ? 'text-emerald-400' : 'text-red-400'}`} title="Screen Share" />
            <Wifi className={`w-3 h-3 ${candidate.internetStatus === 'CONNECTED' ? 'text-emerald-400' : candidate.internetStatus === 'LAGGING' ? 'text-amber-400' : 'text-red-400'}`} title="Internet" />
          </div>
        </div>

        {/* Risk meter & Heartbeat indicator */}
        <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>Ping: {candidate.heartbeatStatus || '1s'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Risk</span>
            <span className={`font-bold font-mono ${isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {candidate.riskScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Candidate Metadata */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-bold text-on-surface text-sm line-clamp-1">{candidate.name}</h4>
            <div className="text-xs text-on-surface-variant font-mono">{candidate.candidateId}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">
              {candidate.terminalId || 'TRM-01'}
            </span>
            <span className="text-[10px] text-on-surface-variant font-mono">
              {candidate.seat}
            </span>
          </div>
        </div>

        {/* Verification Status */}
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-outline-variant/60">
          <span className="text-on-surface-variant">Identity Verified:</span>
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {candidate.verificationStatus || 'VERIFIED'}
          </span>
        </div>

        {candidate.violationType && candidate.violationType !== 'None' && (
          <div className="p-1.5 bg-red-50 border border-red-200 rounded text-[11px] text-red-700 flex items-center gap-1.5 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{candidate.violationType}</span>
          </div>
        )}
      </div>
    </div>
  );
}

