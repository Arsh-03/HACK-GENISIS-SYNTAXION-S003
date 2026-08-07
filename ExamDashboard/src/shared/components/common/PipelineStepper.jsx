import React from 'react';
import { Check, Loader2 } from 'lucide-react';

export function PipelineStepper({ stages = [], activeStage = 3, onSelectStage }) {
  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between overflow-x-auto gap-4">
        {stages.map((stage, idx) => {
          const isCompleted = stage.id < activeStage;
          const isActive = stage.id === activeStage;
          const isPending = stage.id > activeStage;

          return (
            <React.Fragment key={stage.id}>
              <div
                onClick={() => onSelectStage && onSelectStage(stage.id)}
                className={`flex items-center gap-3 cursor-pointer shrink-0 p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary-container/10 border border-primary/30' : 'hover:bg-surface-variant'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-primary text-on-primary ring-4 ring-primary/20 animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stage.id}
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Stage {stage.id}</div>
                  <div className="text-[11px] text-on-surface-variant font-medium">{stage.name}</div>
                </div>
              </div>
              {idx < stages.length - 1 && (
                <div className={`h-0.5 flex-1 min-w-[20px] ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
