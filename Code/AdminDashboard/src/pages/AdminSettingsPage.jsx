import React, { useState } from 'react';
import { Card } from '../shared/components/ui/Card';
import { StatCard } from '../shared/components/ui/StatCard';
import { Badge } from '../shared/components/ui/Badge';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import { ProgressBar } from '../shared/components/ui/ProgressBar';
import {
  Settings,
  Building,
  Shield,
  Cpu,
  Database,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  Clock,
  Key,
  Server,
  Cloud,
  Layers,
  Activity,
  Sparkles
} from 'lucide-react';
import {
  mockOrganizationProfile,
  mockSecuritySettingsData,
  mockAIConfigData,
  mockInfrastructureStatusData
} from '../services/mockData';

export function AdminSettingsPage({ initialTab = 'org' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Form states
  const [org, setOrg] = useState(mockOrganizationProfile);
  const [sec, setSec] = useState(mockSecuritySettingsData);
  const [ai, setAi] = useState(mockAIConfigData);

  const handleSave = () => {
    alert("Settings updated successfully! System policy refreshed.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">Platform Administration Settings</h1>
            <Badge variant="mono" size="sm">ENTERPRISE CONFIG</Badge>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Configure organization profiles, security enforcement, AI LLM engines, and cloud infrastructure telemetry.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Save}
          onClick={handleSave}
          className="font-bold text-xs"
        >
          Save Configuration Changes
        </Button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'org', label: 'Organization Profile', icon: Building },
          { id: 'security', label: 'Security & Policy', icon: Shield },
          { id: 'ai', label: 'AI LLM Engines', icon: Cpu },
          { id: 'infra', label: 'Database & Infrastructure', icon: Database }
        ].map((t) => {
          const IconComp = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORGANIZATION PROFILE */}
      {activeTab === 'org' && (
        <Card title="Organization Details & Branding" subtitle="Official examination council identity and certificate authority settings">
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 bg-surface-bright rounded-xl border border-outline-variant">
              <img src={org.logoUrl} alt={org.name} className="w-16 h-16 rounded-xl object-cover border border-outline-variant shrink-0" />
              <div className="space-y-1">
                <div className="font-bold text-sm text-on-surface">{org.name}</div>
                <div className="text-xs text-on-surface-variant font-mono">{org.code} • {org.examinationAuthority}</div>
                <Button variant="outline" size="sm" className="text-[11px] py-1">Change Organization Logo</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Organization Full Name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
              <Input label="Council Code" value={org.code} onChange={(e) => setOrg({ ...org, code: e.target.value })} />
              <Input label="Official Contact Email" value={org.email} onChange={(e) => setOrg({ ...org, email: e.target.value })} />
              <Input label="Contact Phone" value={org.phone} onChange={(e) => setOrg({ ...org, phone: e.target.value })} />
              <Input label="HQ Address" value={org.address} onChange={(e) => setOrg({ ...org, address: e.target.value })} />
              <Select label="Time Zone Standard" value={org.timeZone} onChange={(e) => setOrg({ ...org, timeZone: e.target.value })}>
                <option value="(UTC+05:30) Asia/Kolkata (IST)">(UTC+05:30) Asia/Kolkata (IST)</option>
                <option value="(UTC+00:00) UTC / London">(UTC+00:00) UTC / London</option>
                <option value="(UTC-05:00) US Eastern Time">(UTC-05:00) US Eastern Time</option>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 2: SECURITY SETTINGS */}
      {activeTab === 'security' && (
        <Card title="Security & Authentication Policies" subtitle="Password strength, session timeouts, multi-factor auth, and IP restrictions">
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Password Minimum Length" type="number" value={sec.passwordMinLength} onChange={(e) => setSec({ ...sec, passwordMinLength: parseInt(e.target.value) })} />
              <Input label="Session Timeout (Minutes)" type="number" value={sec.sessionTimeoutMinutes} onChange={(e) => setSec({ ...sec, sessionTimeoutMinutes: parseInt(e.target.value) })} />
              <Input label="Max Invalid Login Attempts" type="number" value={sec.maxLoginAttempts} onChange={(e) => setSec({ ...sec, maxLoginAttempts: parseInt(e.target.value) })} />
              <Input label="Password Expiry (Days)" type="number" value={sec.passwordExpiryDays} onChange={(e) => setSec({ ...sec, passwordExpiryDays: parseInt(e.target.value) })} />
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center justify-between p-3.5 bg-surface-bright rounded-xl border border-outline-variant cursor-pointer">
                <div className="space-y-0.5">
                  <div className="font-bold text-on-surface">Enforce Multi-Factor Authentication (2FA TOTP)</div>
                  <div className="text-[11px] text-on-surface-variant">Require Google Authenticator / Authy 2FA for all admin and invigilator accounts.</div>
                </div>
                <input type="checkbox" checked={sec.enforce2FA} onChange={(e) => setSec({ ...sec, enforce2FA: e.target.checked })} className="accent-primary w-4 h-4" />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-surface-bright rounded-xl border border-outline-variant cursor-pointer">
                <div className="space-y-0.5">
                  <div className="font-bold text-on-surface">Audit Logging & Cryptographic SHA-256 Checksums</div>
                  <div className="text-[11px] text-on-surface-variant">Record all system events in immutable log ledger.</div>
                </div>
                <input type="checkbox" checked={sec.auditLoggingEnabled} onChange={(e) => setSec({ ...sec, auditLoggingEnabled: e.target.checked })} className="accent-primary w-4 h-4" />
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: AI LLM ENGINES */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
              <Badge variant="mono" size="sm" className="bg-indigo-600 text-white">PRIMARY ACTIVE ENGINE</Badge>
              <div className="font-bold text-base text-indigo-950">Vertex AI Gemini 1.5 Pro</div>
              <div className="text-xs text-indigo-800">Latency: 1.2s • Quality Index: 98.4%</div>
            </div>

            <div className="p-4 bg-surface-bright border border-outline-variant rounded-xl space-y-2 opacity-80">
              <Badge variant="secondary" size="sm">SECONDARY FALLBACK</Badge>
              <div className="font-bold text-base text-on-surface">Claude 3.5 Sonnet</div>
              <div className="text-xs text-on-surface-variant">Standby Mode • Ready</div>
            </div>

            <div className="p-4 bg-surface-bright border border-outline-variant rounded-xl space-y-2 opacity-80">
              <Badge variant="secondary" size="sm">LOCAL KIOSK BACKUP</Badge>
              <div className="font-bold text-base text-on-surface">Llama 3 70B Offline Engine</div>
              <div className="text-xs text-on-surface-variant">Local Hardware Acceleration</div>
            </div>
          </div>

          <Card title="AI Generation Parameters & Prompt Rules" subtitle="Configure temperature, max token generation limits, and validation strictness">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Select label="Primary AI Engine" value={ai.primaryProvider} onChange={(e) => setAi({ ...ai, primaryProvider: e.target.value })}>
                <option value="Vertex AI Gemini 1.5 Pro">Vertex AI Gemini 1.5 Pro (Recommended)</option>
                <option value="Claude 3.5 Sonnet Engine">Claude 3.5 Sonnet Engine</option>
                <option value="Azure OpenAI GPT-4o">Azure OpenAI GPT-4o</option>
              </Select>

              <Input label="Temperature (Randomness: 0.0 - 1.0)" type="number" step="0.05" value={ai.temperature} onChange={(e) => setAi({ ...ai, temperature: parseFloat(e.target.value) })} />
              <Input label="Max Token Count" type="number" value={ai.maxTokens} onChange={(e) => setAi({ ...ai, maxTokens: parseInt(e.target.value) })} />
              <Input label="Daily Generation Limit" type="number" value={ai.generationLimitsDaily} onChange={(e) => setAi({ ...ai, generationLimitsDaily: parseInt(e.target.value) })} />
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: DATABASE & INFRASTRUCTURE */}
      {activeTab === 'infra' && (
        <Card title="Cloud Infrastructure & Database Health Cluster" subtitle="Real-time telemetry for MongoDB, Redis, Cloud Storage, RabbitMQ, and Kong Gateway">
          <div className="space-y-3">
            {mockInfrastructureStatusData.map((item, idx) => (
              <div key={idx} className="p-4 bg-surface-bright rounded-xl border border-outline-variant flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-on-surface">{item.name}</span>
                    <Badge variant="mono" size="sm">{item.type}</Badge>
                  </div>
                  <div className="text-xs text-on-surface-variant mt-0.5">{item.details}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {item.status} ({item.uptime})
                  </div>
                  <div className="text-[11px] font-mono text-on-surface-variant mt-0.5">Latency: {item.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
