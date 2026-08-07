import React from 'react';
import { mockAdminStats } from '../services/mockData';
import { StatCard } from '../shared/components/ui/StatCard';
import { Card } from '../shared/components/ui/Card';
import { Table } from '../shared/components/ui/Table';
import { Badge } from '../shared/components/ui/Badge';
import { Button } from '../shared/components/ui/Button';
import {
  FileText,
  Users,
  ShieldAlert,
  Activity,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Server,
  Cpu
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-on-surface">Enterprise CBT Operations Center</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Real-time telemetry, session monitoring, and high-concurrency exam administration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NavLink to="/ai-pipeline">
            <Button variant="primary" icon={Plus}>
              Create New Exam
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Exam Sessions"
          value={mockAdminStats.activeExams}
          change="+2 from last hour"
          changeType="increase"
          icon={FileText}
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Total Candidates Enrolled"
          value={mockAdminStats.totalCandidates.toLocaleString()}
          change="+12.4% this week"
          changeType="increase"
          icon={Users}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Live Proctored Feeds"
          value={mockAdminStats.liveProctored.toLocaleString()}
          description="High-definition video streams"
          icon={Activity}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Flagged AI Incidents"
          value={mockAdminStats.flaggedIncidents}
          change="Needs Proctor Review"
          changeType="decrease"
          icon={ShieldAlert}
          iconBg="bg-red-50 text-red-600"
        />
      </div>

      {/* Main Grid: Active Sessions Table & System Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Exam Sessions Table */}
        <Card title="Active & Upcoming Examination Sessions" subtitle="Live tracking across all authorized testing centers" className="lg:col-span-2">
          <Table headers={["Exam Title", "Candidates", "Status", "Duration", "Start Time", "Actions"]}>
            {mockAdminStats.recentExams.map((ex) => (
              <tr key={ex.id} className="hover:bg-surface-bright transition-colors">
                <td className="px-4 py-3 font-bold text-xs text-on-surface">{ex.title}</td>
                <td className="px-4 py-3 text-xs text-on-surface-variant font-mono">{ex.candidates}</td>
                <td className="px-4 py-3">
                  <Badge variant={ex.status === 'IN_PROGRESS' ? 'success' : ex.status === 'COMPLETED' ? 'default' : 'info'} size="sm">
                    {ex.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-on-surface-variant font-mono">{ex.duration}</td>
                <td className="px-4 py-3 text-xs text-on-surface-variant font-mono">{ex.startTime}</td>
                <td className="px-4 py-3">
                  <NavLink to="/invigilator">
                    <Button variant="ghost" size="sm" icon={ArrowUpRight}>
                      Monitor
                    </Button>
                  </NavLink>
                </td>
              </tr>
            ))}
          </Table>
        </Card>

        {/* System Telemetry & Cluster Health */}
        <Card title="System Cluster Telemetry" subtitle="Server load, CDN latency, and database status" className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-on-surface-variant flex items-center gap-1.5">
                <Server className="w-4 h-4 text-emerald-600" /> Platform Availability
              </span>
              <span className="font-mono font-bold text-emerald-600">{mockAdminStats.systemHealth}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-on-surface-variant flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" /> Average CPU Cluster Load
              </span>
              <span className="font-mono font-bold text-on-surface">{mockAdminStats.serverCpuLoad}</span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 leading-relaxed font-medium">
              All 14 examination clusters are running optimally with zero packet drop reported.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
