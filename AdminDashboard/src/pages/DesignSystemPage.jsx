import React from 'react';
import { Card } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { Badge } from '../shared/components/ui/Badge';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import { Table } from '../shared/components/ui/Table';
import { ProgressBar } from '../shared/components/ui/ProgressBar';
import { Palette, Type, Layers, CheckCircle2, Sliders, Box } from 'lucide-react';

export function DesignSystemPage() {
  const colorTokens = [
    { name: "Primary (Indigo)", hex: "#3525cd", bgClass: "bg-primary", textClass: "text-white" },
    { name: "Primary Container", hex: "#4f46e5", bgClass: "bg-primary-container", textClass: "text-white" },
    { name: "Surface Dim", hex: "#cbdbf5", bgClass: "bg-surface-dim", textClass: "text-slate-900" },
    { name: "Surface Bright", hex: "#f8f9ff", bgClass: "bg-surface-bright border", textClass: "text-slate-900" },
    { name: "Inverse Surface", hex: "#213145", bgClass: "bg-inverse-surface", textClass: "text-white" },
    { name: "Status Answered", hex: "#059669", bgClass: "bg-status-answered", textClass: "text-white" },
    { name: "Status Marked", hex: "#eab308", bgClass: "bg-status-marked", textClass: "text-slate-900" },
    { name: "Status Unanswered", hex: "#ef4444", bgClass: "bg-status-unanswered", textClass: "text-white" }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-3">
        <div className="p-3 bg-primary/10 text-primary rounded-lg">
          <Palette className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-on-surface">Core Infrastructure Design System</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Material 3 styled design tokens, typography, elevation layers, and reusable UI components.
          </p>
        </div>
      </div>

      {/* Color Tokens */}
      <Card title="Color Palette Tokens" subtitle="Tailored HSL & Hex values for premium enterprise assessment UI">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {colorTokens.map((token) => (
            <div key={token.name} className="p-3 rounded-lg border border-outline-variant bg-surface-bright space-y-2">
              <div className={`h-16 rounded-md ${token.bgClass} flex items-center justify-center font-mono text-xs font-bold ${token.textClass}`}>
                {token.hex}
              </div>
              <div>
                <div className="font-bold text-xs text-on-surface">{token.name}</div>
                <div className="text-[10px] text-on-surface-variant font-mono">{token.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Typography Scale */}
      <Card title="Typography Hierarchy" subtitle="Inter font family for legibility and JetBrains Mono for code & metadata">
        <div className="space-y-4">
          <div className="p-4 bg-surface-bright rounded-lg border border-outline-variant">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant font-mono">Display LG (36px / Bold)</span>
            <div className="text-3xl font-bold text-on-surface mt-1">Enterprise Computer-Based Testing</div>
          </div>
          <div className="p-4 bg-surface-bright rounded-lg border border-outline-variant">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant font-mono">Headline MD (24px / SemiBold)</span>
            <div className="text-xl font-semibold text-on-surface mt-1">Real-time Invigilator & Proctoring Telemetry</div>
          </div>
          <div className="p-4 bg-surface-bright rounded-lg border border-outline-variant">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant font-mono">Label MD (13px / JetBrains Mono)</span>
            <div className="font-mono text-xs text-primary font-bold mt-1">CBT-2026-CONF-MATRIX-KEY-0891</div>
          </div>
        </div>
      </Card>

      {/* Reusable UI Components Demo */}
      <Card title="Component Library Demo" subtitle="Buttons, Badges, Inputs, Selects, and Progress Bars">
        <div className="space-y-6">
          {/* Button Variants */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Button Variants</div>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="warning">Warning Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          {/* Badge Variants */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status Badges</div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success / Live</Badge>
              <Badge variant="warning">Warning / Flagged</Badge>
              <Badge variant="danger">Critical / Terminated</Badge>
              <Badge variant="info">Info / In Progress</Badge>
              <Badge variant="mono">Mono Badge</Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Progress Indicators</div>
            <div className="space-y-2">
              <ProgressBar progress={65} color="bg-primary" />
              <ProgressBar progress={90} color="bg-emerald-600" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
