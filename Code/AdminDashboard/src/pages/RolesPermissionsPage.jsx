import React, { useState } from 'react';
import { Card } from '../shared/components/ui/Card';
import { Badge } from '../shared/components/ui/Badge';
import { Button } from '../shared/components/ui/Button';
import { Table } from '../shared/components/ui/Table';
import { Modal } from '../shared/components/ui/Modal';
import { Shield, Lock, CheckCircle2, Save, Plus } from 'lucide-react';
import { mockRolesMatrix } from '../services/mockData';

export function RolesPermissionsPage() {
  const [roles, setRoles] = useState(mockRolesMatrix);
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const allCapabilities = [
    { code: "USER_MANAGE", label: "User & Staff Account Provisioning", category: "System Administration" },
    { code: "ROLE_MANAGE", label: "Role & RBAC Matrix Editing", category: "System Administration" },
    { code: "EXAM_CREATE", label: "Exam Session & Schedule Creation", category: "Examination" },
    { code: "AI_PAPER_GENERATE", label: "Vertex AI Paper Blueprint Generation", category: "AI Capabilities" },
    { code: "PROCTOR_LIVE", label: "Live Proctoring & Anomaly Monitoring", category: "Proctoring" },
    { code: "TERMINAL_LOCK", label: "Lock & Unlock Candidate Terminals", category: "Proctoring" },
    { code: "SECURITY_OVERRIDE", label: "Security Policy Override & Emergency Stop", category: "Security" },
    { code: "REPORTS_EXPORT", label: "Export Official Audit & Analytics PDFs", category: "Reports" },
    { code: "EXAM_TAKE", label: "Access Candidate CBT Examination Canvas", category: "Candidate Portal" }
  ];

  const togglePermission = (permCode) => {
    const currentPerms = selectedRole.permissions || [];
    const updatedPerms = currentPerms.includes(permCode)
      ? currentPerms.filter(p => p !== permCode)
      : [...currentPerms, permCode];

    const updatedRole = { ...selectedRole, permissions: updatedPerms };
    setSelectedRole(updatedRole);
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">Roles & Permissions Matrix</h1>
            <Badge variant="mono" size="sm">RBAC POLICIES</Badge>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Configure role-based access control, capability scopes, and security permissions across 5 system roles.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Save}
          onClick={() => alert("Role capability matrix successfully saved and synced to API gateway.")}
          className="font-bold text-xs"
        >
          Save & Apply Permissions
        </Button>
      </div>

      {/* Grid: Role Cards & Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Roles List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-on-surface uppercase tracking-wider">System Roles</div>
          {roles.map((r) => {
            const isSelected = selectedRole.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRole(r)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-primary/10 border-primary shadow-xs ring-2 ring-primary/20'
                    : 'bg-surface-container-lowest border-outline-variant hover:bg-surface-bright'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-on-surface">{r.roleName}</div>
                  <Badge variant={r.isSystem ? 'mono' : 'secondary'} size="sm">
                    {r.userCount} Users
                  </Badge>
                </div>
                <div className="text-xs text-on-surface-variant mt-1">{r.description}</div>
              </div>
            );
          })}
        </div>

        {/* Permission Capability Checkboxes Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title={`Permissions Editor: ${selectedRole.roleName}`}
            subtitle={`Toggle granular platform capabilities for ${selectedRole.roleName} role`}
          >
            <div className="space-y-4 text-xs">
              {allCapabilities.map((cap) => {
                const isChecked = selectedRole.permissions?.includes(cap.code);
                return (
                  <label
                    key={cap.code}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-surface-bright border-outline-variant hover:bg-surface-variant'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-on-surface">{cap.label}</div>
                      <div className="text-[10px] font-mono text-on-surface-variant uppercase">{cap.category} • CODE: {cap.code}</div>
                    </div>

                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => togglePermission(cap.code)}
                      className="accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
