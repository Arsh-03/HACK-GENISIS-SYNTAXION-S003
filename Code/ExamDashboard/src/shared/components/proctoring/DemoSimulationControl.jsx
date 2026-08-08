import React, { useState } from 'react';

export const DemoSimulationControl = ({ simulateProctorEvent, activeStudentId, allCandidates = [] }) => {  
  // Hardcoded Aarav Sharma as the default for the demo pitch
  const [selectedTarget, setSelectedTarget] = useState('CBT-2026-0891');

  const currentTarget = selectedTarget || activeStudentId || 'CBT-2026-0891';

  const triggerViolation = (type) => {  
    if (simulateProctorEvent) {
      simulateProctorEvent(currentTarget, type);
    } else {
      console.warn("simulateProctorEvent not provided, cannot emit demo violation.");
    }
  };

  return (  
    <div className="bg-slate-900 text-white p-4 rounded-lg border border-indigo-500 shadow-xl my-4">  
      <div className="flex items-center justify-between mb-2">  
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">⚡ Pitch Demo Trigger Panel (Candidates: {allCandidates?.length})</span>  
        <div className="flex items-center gap-3">
          <select 
            value={selectedTarget} 
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="bg-slate-800 text-xs px-2 py-1 rounded border border-slate-600 outline-none text-white"
          >
            <option value="CBT-2026-0891" className="bg-slate-800 text-white">Aarav Sharma (CBT-2026-0891)</option>
            <option value="CBT-2026-0412" className="bg-slate-800 text-white">Sophia Chen (CBT-2026-0412)</option>
            {allCandidates.filter(c => c.name && c.name !== 'Unknown' && c.candidateId !== 'CBT-2026-0891' && c.candidateId !== 'CBT-2026-0412').map((c, idx) => (
              <option key={c.id || c.candidateId || idx} value={c.candidateId} className="bg-slate-800 text-white">
                {c.name} ({c.candidateId})
              </option>
            ))}
          </select>
          <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded">Network Active</span>  
        </div>
      </div>  
      <div className="grid grid-cols-3 gap-2">  
        <button   
          onClick={() => triggerViolation('HEAD_TURN')}  
          className="bg-amber-600 hover:bg-amber-500 text-white text-xs py-2 px-3 rounded font-medium transition"  
        >  
          Simulate Gaze Turn  
        </button>  
        <button   
          onClick={() => triggerViolation('MULTI_FACE')}  
          className="bg-orange-600 hover:bg-orange-500 text-white text-xs py-2 px-3 rounded font-medium transition"  
        >  
          Simulate Multi-Face  
        </button>  
        <button   
          onClick={() => triggerViolation('TAB_SWITCH')}  
          className="bg-red-600 hover:bg-red-500 text-white text-xs py-2 px-3 rounded font-medium transition"  
        >  
          Simulate Tab Switch (Strike)  
        </button>  
      </div>  
    </div>  
  );  
};
