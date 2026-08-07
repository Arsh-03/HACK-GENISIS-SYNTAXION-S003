import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity, ShieldCheck, Lock, Sparkles, HelpCircle } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between relative overflow-hidden bg-grid-pattern">
      {/* Radial Gradient Glow Highlights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="w-full h-16 px-6 sm:px-12 flex justify-between items-center border-b border-outline-variant bg-surface-bright/80 backdrop-blur-md relative z-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-on-surface flex items-center gap-1.5">
              Nexis CBT <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase font-mono">Platform</span>
            </div>
            <div className="text-[10px] text-on-surface-variant font-medium">AI-Powered Assessment Engine</div>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs text-on-surface-variant font-medium">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-[11px]">System Status: Operational</span>
          </div>

          <a
            href="#support"
            onClick={(e) => { e.preventDefault(); alert("Contacting Nexis Enterprise Support: support@nexiscbt.com"); }}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
          <Outlet />
        </div>
      </main>

      {/* Footer Branding & Security badges */}
      <footer className="w-full py-4 px-6 border-t border-outline-variant bg-surface-bright/80 backdrop-blur-md text-[11px] text-on-surface-variant flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-primary" /> 256-bit AES Encrypted
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ISO/IEC 27001
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Integrity Guard
          </span>
        </div>

        <div>
          © {new Date().getFullYear()} Nexis Assessment Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
