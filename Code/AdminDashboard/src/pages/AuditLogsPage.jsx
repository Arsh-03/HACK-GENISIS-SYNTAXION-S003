import React, { useState } from 'react';
import { Card } from '../shared/components/ui/Card';
import { Badge } from '../shared/components/ui/Badge';
import { Table } from '../shared/components/ui/Table';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import { Button } from '../shared/components/ui/Button';
import { FileText, Search, Shield, Filter, Download } from 'lucide-react';
import { mockAuditLogEntries } from '../services/mockData';

export function AuditLogsPage() {
  const [logs, setLogs] = useState(mockAuditLogEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');

  const filteredLogs = logs.filter(l => {
    const matchesModule = selectedModule === 'ALL' || l.module === selectedModule;
    const matchesSearch = l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.ip.includes(searchTerm);
    return matchesModule && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">System Audit Log Ledger</h1>
            <Badge variant="mono" size="sm">CRYPTOGRAPHIC SHA-256</Badge>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Immutable log ledger tracking administrative changes, proctor overrides, AI pipeline events, and security access.
          </p>
        </div>

        <Button
          variant="outline"
          icon={Download}
          onClick={() => alert("Exporting audit log ledger as encrypted JSON/CSV...")}
          className="text-xs font-bold"
        >
          Export Audit Trail
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant w-full sm:w-80">
          <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
          <input
            type="text"
            placeholder="Search by user, action, IP, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-on-surface focus:outline-none"
          />
        </div>

        <Select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="text-xs w-full sm:w-64"
        >
          <option value="ALL">All System Modules</option>
          <option value="Security & Policy">Security & Policy</option>
          <option value="Live Proctoring">Live Proctoring</option>
          <option value="AI Paper Generation">AI Paper Generation</option>
          <option value="Infrastructure">Infrastructure</option>
        </Select>
      </div>

      {/* Audit Log Table */}
      <Card title="System Audit Event Log Ledger" subtitle="Immutable event history with IP timestamps and status verification">
        <Table headers={["Timestamp", "User Account", "Module", "Action Performed", "IP Address", "Status", "Description"]}>
          {filteredLogs.map((log) => (
            <tr key={log.id} className="hover:bg-surface-bright text-xs transition-colors">
              <td className="px-4 py-3 font-mono text-on-surface-variant">{log.timestamp}</td>
              <td className="px-4 py-3 font-bold text-on-surface">{log.user}</td>
              <td className="px-4 py-3 font-semibold text-primary">{log.module}</td>
              <td className="px-4 py-3 font-bold text-on-surface">{log.action}</td>
              <td className="px-4 py-3 font-mono text-on-surface-variant">{log.ip}</td>
              <td className="px-4 py-3">
                <Badge variant="success" size="sm">{log.status}</Badge>
              </td>
              <td className="px-4 py-3 text-on-surface-variant font-medium">{log.description}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
