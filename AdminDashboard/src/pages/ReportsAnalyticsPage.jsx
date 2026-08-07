import React, { useState } from 'react';
import { Card } from '../shared/components/ui/Card';
import { StatCard } from '../shared/components/ui/StatCard';
import { Badge } from '../shared/components/ui/Badge';
import { Button } from '../shared/components/ui/Button';
import { Table } from '../shared/components/ui/Table';
import { Modal } from '../shared/components/ui/Modal';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import { ProgressBar } from '../shared/components/ui/ProgressBar';
import {
  BarChart3,
  Users,
  Calendar,
  CheckCircle2,
  Cpu,
  UserCheck,
  Award,
  AlertTriangle,
  FileText,
  Clock,
  Shield,
  Download,
  Printer,
  Share2,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  X,
  TrendingUp,
  PieChart,
  Eye,
  Send,
  SlidersHorizontal
} from 'lucide-react';
import {
  mockExecutiveReportKPIs,
  mockCandidatePerformanceReports,
  mockSessionAnalyticsReports,
  mockAttendanceReportsData,
  mockInvigilatorReportsData,
  mockAIGenerationReportsData,
  mockSecurityIncidentReportsData,
  mockAuditReportsData
} from '../services/mockData';

export function ReportsAnalyticsPage({ initialTab = 'executive' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('7d');
  const [selectedSession, setSelectedSession] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  // Detail slide-over drawer state
  const [selectedReportDetail, setSelectedReportDetail] = useState(null);
  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');

  const [kpis, setKpis] = useState(mockExecutiveReportKPIs);
  const [scoreDistribution, setScoreDistribution] = useState([
    { label: '0-20%', height: '15%', count: 12 },
    { label: '20-40%', height: '30%', count: 34 },
    { label: '40-60%', height: '65%', count: 85 },
    { label: '60-80%', height: '95%', count: 142 },
    { label: '80-100%', height: '70%', count: 98 }
  ]);
  const [departmentBreakdown, setDepartmentBreakdown] = useState([
    { department: "Medical Entrance (NEET UG)", registered: 2840, present: 2780, turnout: "97.8%" },
    { department: "Computer Science (Vite/Node CBT)", registered: 120, present: 110, turnout: "91.6%" }
  ]);

  React.useEffect(() => {
    fetch('http://localhost:5001/api/reports/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setKpis({
            totalRegisteredCandidates: String(data.totalRegisteredCandidates),
            activeSessions: data.activeSessions,
            completedExaminations: data.completedExaminations,
            aiGeneratedPapers: data.aiGeneratedPapers,
            totalInvigilators: data.totalInvigilators,
            overallAttendance: data.overallAttendance,
            overallPassPercentage: data.overallPassPercentage,
            securityIncidents: data.securityIncidents
          });
          if (data.scoreDistribution) {
            setScoreDistribution(data.scoreDistribution);
          }
          if (data.departmentBreakdown) {
            setDepartmentBreakdown(data.departmentBreakdown);
          }
        }
      })
      .catch(err => console.error('Error fetching dashboard reports', err));
  }, []);

  const handleExport = (type) => {
    alert(`Exporting ${activeTab.toUpperCase()} report as ${type.toUpperCase()}... File generation started.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      {/* Page Title & Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">Reports & Analytics Center</h1>
            <Badge variant="mono" size="sm">ENTERPRISE AUDIT</Badge>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Real-time examination telemetry, candidate performance scorecards, AI metrics, and security audit logs.
          </p>
        </div>

        {/* Global Export & Share Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => handleExport('pdf')}
            className="text-xs"
          >
            PDF Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => handleExport('excel')}
            className="text-xs"
          >
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => handleExport('csv')}
            className="text-xs"
          >
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={() => window.print()}
            className="text-xs hidden sm:flex"
          >
            Print
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Share2}
            onClick={() => setIsShareModalOpen(true)}
            className="text-xs font-semibold"
          >
            Share Report
          </Button>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 items-center text-xs">
        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant">
          <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
          <input
            type="text"
            placeholder="Search candidate, session, paper..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-on-surface focus:outline-none"
          />
        </div>

        <Select
          value={selectedDateRange}
          onChange={(e) => setSelectedDateRange(e.target.value)}
          className="text-xs"
        >
          <option value="today">Date Range: Today</option>
          <option value="7d">Date Range: Last 7 Days</option>
          <option value="30d">Date Range: Last 30 Days</option>
          <option value="ytd">Date Range: Year To Date</option>
        </Select>

        <Select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="text-xs"
        >
          <option value="ALL">All Examination Sessions</option>
          <option value="med-02">Medical Board Entrance Slot 02</option>
          <option value="cs-01">CS Engineering Finals Slot 01</option>
          <option value="corp-03">Corporate Compliance Slot 03</option>
        </Select>

        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="text-xs"
        >
          <option value="ALL">All Subjects</option>
          <option value="cs">Physics & Chemistry</option>
          <option value="med">Medical Sciences</option>
          <option value="civil">Civil Engineering</option>
        </Select>

        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={() => {
            setSearchTerm('');
            setSelectedDateRange('7d');
            setSelectedSession('ALL');
            setSelectedSubject('ALL');
          }}
          className="w-full text-xs"
        >
          Reset Filters
        </Button>
      </div>

      {/* Module Report Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-outline-variant pb-1">
        {[
          { id: 'executive', label: 'Executive Dashboard', icon: BarChart3 }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================================================== */}
      {/* TAB 1: EXECUTIVE DASHBOARD */}
      {/* ==================================================== */}
      {activeTab === 'executive' && (
        <div className="space-y-6">
          {/* 8 KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Registered Candidates"
              value={kpis.totalRegisteredCandidates}
              subtitle="Total active enrolments"
              icon={Users}
              trend={{ direction: 'up', value: '+12.4% vs last term' }}
            />
            <StatCard
              title="Active Sessions"
              value={kpis.activeSessions.toString()}
              subtitle="Live proctored halls"
              icon={Calendar}
              badge={{ variant: 'mono', text: 'LIVE' }}
            />
            <StatCard
              title="Completed Exams"
              value={kpis.completedExaminations.toString()}
              subtitle="Evaluated test papers"
              icon={CheckCircle2}
            />
            <StatCard
              title="AI Generated Papers"
              value={kpis.aiGeneratedPapers.toString()}
              subtitle="Vertex AI blueprint builds"
              icon={Cpu}
              trend={{ direction: 'up', value: '98.4% validation' }}
            />
            <StatCard
              title="Total Invigilators"
              value={kpis.totalInvigilators.toString()}
              subtitle="Proctoring staff on duty"
              icon={UserCheck}
            />
            <StatCard
              title="Overall Attendance"
              value={kpis.overallAttendance}
              subtitle="13,936 present candidates"
              icon={Clock}
              trend={{ direction: 'up', value: '+1.2% turnout' }}
            />
            <StatCard
              title="Overall Pass Rate"
              value={kpis.overallPassPercentage}
              subtitle="Cutoff score standard"
              icon={Award}
            />
            <StatCard
              title="Security Incidents"
              value={kpis.securityIncidents.toString()}
              subtitle="Flags audited today"
              icon={AlertTriangle}
              trend={{ direction: 'down', value: '-24% violations' }}
            />
          </div>

          {/* Visual Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Score Bell-Curve Distribution */}
            <Card title="Candidate Score Bell-Curve Distribution" subtitle="Normalized score percentiles across all cohorts">
              <div className="space-y-4 pt-2">
                <div className="flex justify-between text-xs text-on-surface-variant font-semibold">
                  <span>Below 40% (Fail): 10.6%</span>
                  <span>40% - 75% (Pass): 58.2%</span>
                  <span className="text-emerald-600 font-bold">75%+ (Distinction): 31.2%</span>
                </div>
                <div className="h-40 bg-surface-bright rounded-xl p-4 flex items-end justify-between gap-2 border border-outline-variant">
                  {scoreDistribution.map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="text-[10px] font-mono font-bold text-on-surface-variant">{bar.count}</div>
                      <div
                        className="w-full bg-primary/80 rounded-t-lg hover:bg-primary transition-all cursor-pointer"
                        style={{ height: bar.height }}
                        title={`${bar.label}: ${bar.count} candidates`}
                      />
                      <div className="text-[10px] font-semibold text-on-surface-variant">{bar.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card title="Attendance & Department Turnout Breakdown" subtitle="Real-time check-in ratio across faculties">
              <div className="space-y-3 pt-2">
                {departmentBreakdown.map((dept, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-on-surface">{dept.department}</span>
                      <span className="font-mono text-emerald-600 font-bold">{dept.present} / {dept.registered} ({dept.turnout})</span>
                    </div>
                    <ProgressBar progress={parseFloat(dept.turnout)} height="h-2" color="bg-emerald-600" />
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: CANDIDATE PERFORMANCE REPORTS */}
      {/* ==================================================== */}
      {activeTab === 'candidate' && (
        <Card title="Candidate Performance & Scorecard Ledger" subtitle="Individual examination results, percentile rank, and subject performance">
          <Table headers={["Candidate Name", "Reg Number", "Session", "Score", "Rank", "Time Taken", "Status", "Actions"]}>
            {mockCandidatePerformanceReports.map((row) => (
              <tr key={row.id} className="hover:bg-surface-bright text-xs transition-colors">
                <td className="px-4 py-3 font-bold text-on-surface">{row.name}</td>
                <td className="px-4 py-3 font-mono text-primary font-bold">{row.regNo}</td>
                <td className="px-4 py-3 font-medium text-on-surface-variant">{row.session}</td>
                <td className="px-4 py-3 font-mono font-bold">{row.score} / {row.maxScore} ({row.percentage})</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-600">{row.rank}</td>
                <td className="px-4 py-3 font-mono text-on-surface-variant">{row.timeTaken}</td>
                <td className="px-4 py-3">
                  <Badge variant={row.status === 'PASSED' ? 'success' : 'danger'} size="sm">
                    {row.resultBadge}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => setSelectedReportDetail({ title: `Candidate Report: ${row.name}`, type: 'CANDIDATE', data: row })}
                    className="text-xs"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* ==================================================== */}
      {/* TAB 3: SESSION ANALYTICS */}
      {/* ==================================================== */}
      {activeTab === 'session' && (
        <Card title="Session Capacity & Telemetry Analytics" subtitle="Halls utilization, completion rate, and invigilator monitoring">
          <Table headers={["Session Title", "Date", "Assigned", "Appeared", "Avg Completion Time", "Success Rate", "Status", "Action"]}>
            {mockSessionAnalyticsReports.map((row) => (
              <tr key={row.id} className="hover:bg-surface-bright text-xs transition-colors">
                <td className="px-4 py-3 font-bold text-on-surface">{row.title}</td>
                <td className="px-4 py-3 font-mono text-on-surface-variant">{row.date}</td>
                <td className="px-4 py-3 font-mono font-bold">{row.assigned} / {row.capacity}</td>
                <td className="px-4 py-3 font-mono text-emerald-600 font-bold">{row.appeared}</td>
                <td className="px-4 py-3 font-mono text-on-surface-variant">{row.avgTime}</td>
                <td className="px-4 py-3 font-mono text-primary font-bold">{row.successRate}</td>
                <td className="px-4 py-3">
                  <Badge variant={row.status === 'COMPLETED' ? 'success' : 'mono'} size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => setSelectedReportDetail({ title: row.title, type: 'SESSION', data: row })}
                    className="text-xs"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* ==================================================== */}
      {/* TAB 4: ATTENDANCE REPORTS */}
      {/* ==================================================== */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard title="Registered" value="14,250" subtitle="Total roster" icon={Users} />
            <StatCard title="Present" value="13,936" subtitle="97.8% turnout" icon={UserCheck} trend={{ direction: 'up', value: 'High' }} />
            <StatCard title="Absent" value="314" subtitle="Absentee log" icon={X} />
            <StatCard title="Late Entry" value="42" subtitle="Override entries" icon={Clock} />
          </div>

          <Card title="Department Turnout Ledger" subtitle="Faculty level candidate attendance breakdown">
            <Table headers={["Department", "Registered", "Present", "Absent", "Turnout %"]}>
              {mockAttendanceReportsData.departmentBreakdown.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-bright text-xs">
                  <td className="px-4 py-3 font-bold text-on-surface">{row.department}</td>
                  <td className="px-4 py-3 font-mono">{row.registered}</td>
                  <td className="px-4 py-3 font-mono text-emerald-600 font-bold">{row.present}</td>
                  <td className="px-4 py-3 font-mono text-red-600 font-bold">{row.absent}</td>
                  <td className="px-4 py-3 font-mono font-bold text-primary">{row.turnout}</td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: INVIGILATOR AUDIT REPORTS */}
      {/* ==================================================== */}
      {activeTab === 'invigilator' && (
        <Card title="Invigilator Duty & Incident Response Audit" subtitle="Proctor performance, assigned hall candidate count, and resolution times">
          <Table headers={["Invigilator Name", "Assigned Hall", "Assigned Candidates", "Flagged Incidents", "Avg Resolution Time", "Proctor Rating", "Status"]}>
            {mockInvigilatorReportsData.map((row) => (
              <tr key={row.id} className="hover:bg-surface-bright text-xs transition-colors">
                <td className="px-4 py-3 font-bold text-on-surface">{row.name}</td>
                <td className="px-4 py-3 font-semibold text-primary">{row.hall}</td>
                <td className="px-4 py-3 font-mono font-bold">{row.assignedCandidates}</td>
                <td className="px-4 py-3 font-mono text-amber-600 font-bold">{row.flaggedIncidents}</td>
                <td className="px-4 py-3 font-mono text-on-surface-variant">{row.avgResolutionTime}</td>
                <td className="px-4 py-3 font-mono text-emerald-600 font-bold">{row.rating}</td>
                <td className="px-4 py-3">
                  <Badge variant={row.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* ==================================================== */}
      {/* TAB 6: AI GENERATION TELEMETRY */}
      {/* ==================================================== */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard title="Papers Generated" value="42" subtitle="AI blueprint builds" icon={Cpu} />
            <StatCard title="Avg Generation Speed" value="14.2s" subtitle="End-to-end pipeline" icon={Clock} />
            <StatCard title="Validation Success" value="98.4%" subtitle="Zero hallucination" icon={CheckCircle2} />
            <StatCard title="AI Confidence Score" value="96.8%" subtitle="Bloom compliance" icon={Award} />
          </div>

          <Card title="AI Provider Performance & Latency Telemetry" subtitle="Vertex AI Gemini 1.5 Pro, Claude, and Azure OpenAI LLM benchmarks">
            <Table headers={["AI Provider Engine", "Requests Processed", "Average Latency", "Pipeline Reliability"]}>
              {mockAIGenerationReportsData.providerTelemetry.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-bright text-xs">
                  <td className="px-4 py-3 font-bold text-on-surface">{row.provider}</td>
                  <td className="px-4 py-3 font-mono font-bold">{row.requests}</td>
                  <td className="px-4 py-3 font-mono text-primary font-bold">{row.avgLatency}</td>
                  <td className="px-4 py-3 font-mono text-emerald-600 font-bold">{row.reliability}</td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 7: SECURITY & VIOLATION INCIDENTS */}
      {/* ==================================================== */}
      {activeTab === 'incident' && (
        <Card title="Security Violation & Integrity Audit Ledger" subtitle="Proctoring anomaly flags, tab switches, camera disruptions, and severity ratings">
          <Table headers={["Incident Type", "Candidate & ID", "Severity", "Timestamp", "Terminal", "Status", "Action Taken"]}>
            {mockSecurityIncidentReportsData.map((row) => (
              <tr key={row.id} className="hover:bg-surface-bright text-xs transition-colors">
                <td className="px-4 py-3 font-bold text-on-surface">{row.type}</td>
                <td className="px-4 py-3 font-medium text-on-surface-variant">{row.candidate}</td>
                <td className="px-4 py-3">
                  <Badge variant={row.severity === 'CRITICAL' ? 'danger' : 'warning'} size="sm">
                    {row.severity}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-mono text-on-surface-variant">{row.timestamp}</td>
                <td className="px-4 py-3 font-mono text-primary font-bold">{row.terminal}</td>
                <td className="px-4 py-3 font-bold text-xs">{row.status}</td>
                <td className="px-4 py-3 text-on-surface font-semibold">{row.actionTaken}</td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* ==================================================== */}
      {/* TAB 8: AUDIT REPORTS */}
      {/* ==================================================== */}
      {activeTab === 'audit' && (
        <Card title="Platform System & Administrative Audit Logs" subtitle="Security sign-offs, administrative overrides, and report exports">
          <Table headers={["Timestamp", "User Account", "Action Performed", "IP Address", "Status"]}>
            {mockAuditReportsData.map((row) => (
              <tr key={row.id} className="hover:bg-surface-bright text-xs">
                <td className="px-4 py-3 font-mono text-on-surface-variant">{row.timestamp}</td>
                <td className="px-4 py-3 font-bold text-on-surface">{row.user}</td>
                <td className="px-4 py-3 font-semibold text-primary">{row.action}</td>
                <td className="px-4 py-3 font-mono text-on-surface-variant">{row.ip}</td>
                <td className="px-4 py-3">
                  <Badge variant="success" size="sm">{row.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* ==================================================== */}
      {/* INTERACTIVE REPORT DETAILS DRAWER (SLIDE-OVER) */}
      {/* ==================================================== */}
      {selectedReportDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-surface-container-lowest h-full shadow-2xl overflow-y-auto p-6 space-y-6 flex flex-col justify-between border-l border-outline-variant animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                <div>
                  <Badge variant="mono" size="sm">DETAILED REPORT INSPECTOR</Badge>
                  <h2 className="text-lg font-bold text-on-surface mt-1">{selectedReportDetail.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedReportDetail(null)}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-variant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Data Summary View */}
              <div className="space-y-4 text-xs">
                <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant space-y-2">
                  <div className="font-bold text-on-surface">Record Data Overview:</div>
                  <pre className="font-mono text-[11px] text-slate-700 bg-slate-100 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(selectedReportDetail.data, null, 2)}
                  </pre>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-on-surface">Audit & Compliance Signature:</div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-mono text-[11px]">
                    SHA-256 Checksum: 0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-outline-variant pt-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedReportDetail(null)}
                className="w-full"
              >
                Close Inspector
              </Button>
              <Button
                variant="primary"
                icon={Download}
                onClick={() => handleExport('pdf')}
                className="w-full"
              >
                Export Record PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SHARE REPORT MODAL DIALOG */}
      {/* ==================================================== */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Audit & Analytics Report"
        icon={Share2}
        iconBg="bg-indigo-100 text-indigo-600"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsShareModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={Send}
              onClick={() => {
                alert(`Report link and encrypted PDF dispatch queued for ${shareEmail || 'administrator@university.edu'}`);
                setIsShareModalOpen(false);
              }}
            >
              Send Secure Share Link
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs text-on-surface-variant">
          <p>
            Generate a time-limited, encrypted access link to share this <strong>{activeTab.toUpperCase()}</strong> report with external accreditation bodies or senior executive leadership.
          </p>
          <Input
            label="Recipient Email Address"
            type="email"
            placeholder="e.g. dean.academics@university.edu"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
        </div>
      </Modal>

    </div>
  );
}
