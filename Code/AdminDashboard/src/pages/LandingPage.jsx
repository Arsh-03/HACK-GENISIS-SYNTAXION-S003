import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import {
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Activity,
  SlidersHorizontal,
  UserCheck,
  Lock,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

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
              N.E.S.T <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase font-mono">Platform</span>
            </div>
            <div className="text-[10px] text-on-surface-variant font-medium">Enterprise Assessment Suite</div>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs text-on-surface-variant font-medium">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-[11px]">System Operational</span>
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

      {/* Main Content Hero & Cards */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative z-10 max-w-5xl mx-auto w-full">
        {/* Title Section */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Your Entry Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            Welcome to Nexis Assessment Engine
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto">
            Choose your authorized entry portal below to access administration tools, invigilator operations, or candidate examination dashboards.
          </p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Card 1: Administrator Portal */}
          <div
            onClick={() => navigate('/admin/login')}
            className="cursor-pointer group rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors shadow-sm">
                <SlidersHorizontal className="w-7 h-7" />
              </div>

              <h2 className="text-2xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                Administrator Portal
              </h2>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                Manage candidate enrollments, question banks, AI paper generation pipelines, exam sessions, live proctoring telemetry, and system settings.
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Full Administrative Control & System Configuration</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>AI Assessment Pipeline & Analytics Dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Role & User Management Modules</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-md group-hover:bg-primary-hover"
            >
              <span>Access Administrator Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Card 2: Examination Portal */}
          <div
            onClick={() => navigate('/exam/login')}
            className="cursor-pointer group rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-lg hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                <BookOpen className="w-7 h-7" />
              </div>

              <h2 className="text-2xl font-bold text-on-surface mb-2 group-hover:text-emerald-600 transition-colors">
                Examination Portal
              </h2>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                Access secure candidate CBT examination environment or live invigilator monitoring desk for test hall proctoring.
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Candidate Focus-Mode Examination Workspace</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Invigilator Seat Mapping & Real-Time Proctored Feeds</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Automated AI Integrity Guard Verification</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 shadow-sm"
            >
              <span>Access Examination Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full py-4 px-6 border-t border-outline-variant bg-surface-bright/80 backdrop-blur-md text-[11px] text-on-surface-variant flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-primary" /> 256-bit AES Encrypted
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ISO/IEC 27001
          </span>
        </div>

        <div>
          © {new Date().getFullYear()} Nexis Assessment Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
