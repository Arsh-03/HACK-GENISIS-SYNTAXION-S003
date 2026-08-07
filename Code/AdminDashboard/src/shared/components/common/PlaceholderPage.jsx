import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import {
  ChevronRight,
  Home,
  Construction,
  Sparkles,
  Clock,
  CheckCircle2,
  FileCode,
  ArrowLeft,
  BellRing
} from 'lucide-react';

export function PlaceholderPage({
  title = "Module Page",
  category = "Administration",
  description = "Enterprise module feature currently undergoing security audit and feature integration.",
  icon: Icon = Construction,
  plannedFeatures = [
    "Real-time telemetry and audit stream integration",
    "Role-based access control (RBAC) and permissions scoping",
    "Automated data export (CSV, JSON, PDF formats)",
    "AI-assisted insights and predictive flag analysis"
  ],
  estimatedRelease = "Q3 2026",
  progress = 75
}) {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
        <Link to="/admin" className="flex items-center gap-1 hover:text-primary transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-on-surface-variant">{category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-primary font-mono">{title}</span>
      </nav>

      {/* Consistent Page Header */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-on-surface">{title}</h1>
              <Badge variant="info">In Development</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/admin">
            <Button variant="outline" size="sm" icon={ArrowLeft}>
              Back to Overview
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Stat Skeletons (Hackathon-ready preview) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
            <span>Module Status</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <div className="text-lg font-bold text-on-surface">Phase 2 Sandbox</div>
          <div className="text-[11px] text-on-surface-variant">Core schema & state engine active</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
            <span>Planned Capacity</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="text-lg font-bold text-primary font-mono">Target {estimatedRelease}</div>
          <div className="text-[11px] text-on-surface-variant">Enterprise release pipeline</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
            <span>Security Compliance</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-emerald-600">ISO/IEC Ready</div>
          <div className="text-[11px] text-on-surface-variant">256-bit encrypted telemetry</div>
        </div>
      </div>

      {/* Main Coming Soon / Under Construction Card */}
      <Card
        title={`${title} Module`}
        subtitle={`Specification & Roadmap Overview (${category})`}
        accentLeft={true}
        accentColor="bg-amber-500"
      >
        <div className="space-y-6">
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-lg">
                <Construction className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-amber-900">Module Under Construction</div>
                <div className="text-xs text-amber-800">
                  This section is being actively developed according to the Nexis CBT Platform roadmap.
                </div>
              </div>
            </div>
            <div className="w-full md:w-48 space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-amber-900">
                <span>Build Progress</span>
                <span>{progress}%</span>
              </div>
              <ProgressBar progress={progress} color="bg-amber-600" />
            </div>
          </div>

          {/* Planned Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Planned Enterprise Capabilities
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plannedFeatures.map((feat, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-surface-bright border border-outline-variant flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-on-surface">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-outline-variant flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-on-surface-variant flex items-center gap-2">
              <FileCode className="w-4 h-4 text-primary" />
              <span>Route endpoint: <code className="font-mono bg-surface-container-high px-1.5 py-0.5 rounded text-primary">{window.location.pathname}</code></span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={BellRing}
                onClick={() => alert(`Subscribed to update notifications for ${title}`)}
              >
                Notify Me
              </Button>
              <Link to="/admin/ai/pipeline">
                <Button variant="primary" size="sm">
                  Explore Active AI Pipeline
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
