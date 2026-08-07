import React from 'react';

export const SecurityHUD = ({ hashStatus, isEncrypted, JITStatus }) => (  
  <div className="bg-slate-950 text-slate-300 px-4 py-1.5 flex flex-col md:flex-row items-center justify-between text-xs font-mono border-b border-slate-800">  
    <div className="flex items-center space-x-4 mb-2 md:mb-0">  
      <span className="flex items-center text-emerald-400 font-semibold">  
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping mr-2"></span>  
        TERMINAL LOCKED  
      </span>  
      <span className="hidden sm:inline">PAYLOAD: <strong className="text-cyan-400">AES-256-GCM (IN-RAM ONLY)</strong></span>  
      <span className="hidden sm:inline">DB HASH CHAIN: <strong className="text-emerald-400">VALID (0x8F3A...)</strong></span>  
    </div>  
    <div className="text-slate-400 flex items-center space-x-2">  
      {JITStatus === 'ACTIVE' && (
        <span className="text-amber-400 font-bold px-2 py-0.5 border border-amber-500/50 rounded bg-amber-500/10 mr-2">JIT TIME-WARP ENABLED</span>
      )}
      <span>SESSION SEED: <span className="text-amber-400">ROLL_10294_SHIFT_1</span></span>  
    </div>  
  </div>  
);
