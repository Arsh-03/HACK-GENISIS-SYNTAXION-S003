import React from 'react';

export const DemoSimulationControl = ({ socket, activeStudentId }) => {  
  const triggerViolation = (type) => {  
    if (socket) {
      socket.emit('SIMULATE_PROCTOR_EVENT', {  
        candidateId: activeStudentId || 'CANDIDATE-101',  
        violationType: type,  
        timestamp: new Date().toISOString()  
      });  
    } else {
      console.warn("Socket not connected, cannot emit demo violation.");
    }
  };

  return (  
    <div className="bg-slate-900 text-white p-4 rounded-lg border border-indigo-500 shadow-xl my-4">  
      <div className="flex items-center justify-between mb-2">  
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">⚡ Pitch Demo Trigger Panel</span>  
        <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded">Fail-Safe Active</span>  
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
