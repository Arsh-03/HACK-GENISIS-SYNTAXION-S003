import React, { useState } from 'react';
import { useProctoringStream } from '../hooks/useProctoringStream';
import { ProctoringCard } from '../shared/components/common/ProctoringCard';
import { Card } from '../shared/components/ui/Card';
import { StatCard } from '../shared/components/ui/StatCard';
import { Button } from '../shared/components/ui/Button';
import { Badge } from '../shared/components/ui/Badge';
import { Modal } from '../shared/components/ui/Modal';
import { ProgressBar } from '../shared/components/ui/ProgressBar';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import { LiveFeedFrame } from '../shared/components/common/LiveFeedFrame';
import { DemoSimulationControl } from '../shared/components/proctoring/DemoSimulationControl';
import { useLiveFeedRegistry } from '../hooks/useLiveFeedRegistry';
import {
  ShieldAlert,
  Filter,
  RefreshCw,
  AlertTriangle,
  Send,
  XCircle,
  Activity,
  Users,
  Eye,
  Search,
  MapPin,
  Bell,
  FileText,
  BarChart3,
  Play,
  Pause,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Wifi,
  Camera,
  Mic,
  Monitor,
  UserCheck,
  UserX,
  MessageSquare,
  Flag,
  UserCog,
  ChevronRight,
  X,
  AlertCircle,
  HelpCircle,
  FileSpreadsheet,
  Download,
  Shield,
  Radio
} from 'lucide-react';

export function InvigilatorDashboardPage() {
  const {
    candidates,
    allCandidates,
    logs,
    kpis,
    seats,
    alerts,
    incidents,
    analytics,
    sessionStatus,
    setSessionStatus,
    activeTab,
    setActiveTab,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    selectedCandidate,
    setSelectedCandidate,
    isMessagingOpen,
    setIsMessagingOpen,
    messageRecipient,
    setMessageRecipient,
    messageType,
    setMessageType,
    isReassignModalOpen,
    setIsReassignModalOpen,
    terminateSession,
    issueWarning,
    updateIncidentStatus,
    reassignCandidateSeat
  } = useProctoringStream();
  const liveFeedRegistry = useLiveFeedRegistry();

  const [customMsgText, setCustomMsgText] = useState('');
  const [reassignSeatValue, setReassignSeatValue] = useState('');

  const getKpiIcon = (iconName) => {
    switch (iconName) {
      case 'Clock': return Clock;
      case 'Users': return Users;
      case 'CheckCircle': return CheckCircle2;
      case 'AlertTriangle': return AlertTriangle;
      case 'ShieldAlert': return ShieldAlert;
      case 'Activity': return Activity;
      default: return Shield;
    }
  };

  const criticalCount = allCandidates.filter(c => c.status === 'CRITICAL').length;
  const warningCount = allCandidates.filter(c => c.status === 'WARNING').length;
  const normalCount = allCandidates.filter(c => c.status === 'NORMAL').length;
  const offlineCount = allCandidates.filter(c => c.status === 'OFFLINE').length;

  const handleOpenMessaging = (cand, defaultType = 'WARNING') => {
    setMessageRecipient(cand);
    setMessageType(defaultType);
    setCustomMsgText(
      defaultType === 'WARNING' ? 'Official Warning: Maintain continuous eye contact with your webcam.' :
      defaultType === 'REMINDER' ? 'Reminder: 30 minutes remaining in the examination session.' :
      defaultType === 'ATTENTION' ? 'Attention Candidate: Please adjust your webcam angle to clarify face visibility.' :
      'Technical Support dispatch queued for your terminal station.'
    );
    setIsMessagingOpen(true);
  };

  const getCandidateFeed = (candidate) => {
    const feed = liveFeedRegistry[candidate.candidateId];
    return {
      ...candidate,
      frameUrl: feed?.frameUrl || feed?.streamUrl || `http://localhost:5001/api/feeds/${candidate.candidateId}/stream`,
      liveFeedUrl: feed?.streamUrl || `http://localhost:5001/api/feeds/${candidate.candidateId}/stream`,
      heartbeatStatus: feed ? 'LIVE' : candidate.heartbeatStatus || 'Awaiting feed'
    };
  };

  const inspectedCandidateFeed = selectedCandidate ? getCandidateFeed(selectedCandidate) : null;

  return (
    <div className="flex-1 overflow-y-auto h-full p-6 md:p-8 space-y-8 pb-12 w-full">

      {/* ==================================================== */}
      {/* 1. CONTROL ROOM HEADER & SESSION CONTROL TOOLBAR */}
      {/* ==================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-700/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/20 backdrop-blur-md rounded-xl border border-red-500/30 shadow-inner">
                <ShieldAlert className="w-7 h-7 text-red-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-black tracking-tight text-white">Live Examination Monitoring Center</h1>
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 border ${
                    sessionStatus === 'RUNNING' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                    sessionStatus === 'PAUSED' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    sessionStatus === 'LOCKED' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                    'bg-slate-500/20 text-slate-300 border-slate-500/40'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      sessionStatus === 'RUNNING' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                    }`} />
                    SESSION {sessionStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  National Medical Board Entrance 2026 • Exam Hall A • 460 Allocated Terminals • Active AI Proctoring Telemetry
                </p>
              </div>
            </div>
          </div>

          {/* SESSION CONTROL BUTTONS */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {sessionStatus === 'RUNNING' ? (
              <Button
                variant="warning"
                size="md"
                icon={Pause}
                onClick={() => setSessionStatus('PAUSED')}
                className="font-bold text-xs"
              >
                Pause Session
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                icon={Play}
                onClick={() => setSessionStatus('RUNNING')}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
              >
                {sessionStatus === 'PAUSED' ? 'Resume Session' : 'Start Session'}
              </Button>
            )}

            <Button
              variant="danger"
              size="md"
              icon={Lock}
              onClick={() => setSessionStatus(sessionStatus === 'LOCKED' ? 'RUNNING' : 'LOCKED')}
              className="font-bold text-xs"
            >
              {sessionStatus === 'LOCKED' ? 'Unlock Exam' : 'Lock Exam'}
            </Button>

            <Button
              variant="secondary"
              size="md"
              icon={FileSpreadsheet}
              onClick={() => alert("Official Incident Audit Dossier generated and sent to examination board.")}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs font-semibold text-xs"
            >
              Incident Report
            </Button>

            <Button
              variant="secondary"
              size="md"
              icon={XCircle}
              onClick={() => {
                if (window.confirm("Are you sure you want to conclude and lock all exam terminals?")) {
                  setSessionStatus('ENDED');
                }
              }}
              className="bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800 font-semibold text-xs"
            >
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. INVIGILATOR OVERVIEW DASHBOARD (KPI CARDS) */}
      {/* ==================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary animate-pulse" />
            Live Exam Control Room Telemetry
          </h2>
          <span className="text-[11px] font-mono text-on-surface-variant font-medium">Real-time feed sync</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((kpi) => {
            const IconComp = getKpiIcon(kpi.icon);
            return (
              <StatCard
                key={kpi.id}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.changeType}
                description={kpi.description}
                icon={IconComp}
                iconBg={kpi.iconBg}
              />
            );
          })}
        </div>
      </section>

      {/* DEMO SIMULATION CONTROL */}
      <DemoSimulationControl socket={null} activeStudentId={selectedCandidate?.candidateId} />

      {/* ==================================================== */}
      {/* 3. CONTROL ROOM VIEW SWITCHER TABS */}
      {/* ==================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-outline-variant pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('SEAT_MAP')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'SEAT_MAP'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-bright'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Interactive Seat Map</span>
          </button>

          <button
            onClick={() => setActiveTab('ALERTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'ALERTS'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-bright'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Alert Center ({alerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('INCIDENTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'INCIDENTS'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-bright'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Incident Ledger ({incidents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'ANALYTICS'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-bright'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Control Room Analytics</span>
          </button>
        </div>

        {/* Global Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, reg #, terminal, seat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
          />
        </div>
      </div>

      {/* ==================================================== */}
      {/* TAB 2: INTERACTIVE SEAT MAP */}
      {/* ==================================================== */}
      {activeTab === 'SEAT_MAP' && (
        <Card
          title="Exam Hall Floorplan & Interactive Seat Layout"
          subtitle="Real-time terminal status map (Green: Normal, Yellow: Warning, Red: Critical, Gray: Offline). Click any seat to inspect student drawer."
          headerAction={
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500" /> Normal</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500" /> Warning</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500" /> Critical</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-400" /> Offline</span>
            </div>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {seats.map((seat) => {
              const matchedCandidate = allCandidates.find(c => c.name === seat.candidateName || c.candidateId === seat.candidateId);
              const isNormal = seat.status === 'NORMAL';
              const isWarning = seat.status === 'WARNING';
              const isCritical = seat.status === 'CRITICAL';

              return (
                <div
                  key={seat.seatId}
                  onClick={() => {
                    if (matchedCandidate) {
                      setSelectedCandidate(matchedCandidate);
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                    isCritical ? 'bg-red-50 border-red-300 hover:bg-red-100 ring-1 ring-red-400' :
                    isWarning ? 'bg-amber-50 border-amber-300 hover:bg-amber-100' :
                    isNormal ? 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100' :
                    'bg-slate-100 border-slate-300 opacity-70'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                    <span className="text-on-surface">{seat.deskNumber}</span>
                    <span className={`px-1.5 py-0.5 rounded uppercase text-[9px] text-white ${
                      isCritical ? 'bg-red-600' : isWarning ? 'bg-amber-600' : isNormal ? 'bg-emerald-600' : 'bg-slate-600'
                    }`}>
                      {seat.status}
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="text-xs font-bold text-on-surface line-clamp-1">{seat.candidateName}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">{seat.terminalId}</div>
                  </div>

                  <div className="mt-2 text-[10px] text-on-surface-variant flex justify-between items-center border-t border-outline-variant/40 pt-1">
                    <span>ID: {seat.candidateId.split('-')[2]}</span>
                    <ChevronRight className="w-3 h-3 text-on-surface-variant" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ==================================================== */}
      {/* TAB 3: ALERT CENTER */}
      {/* ==================================================== */}
      {activeTab === 'ALERTS' && (
        <Card
          title="Live Alert & Violation Center"
          subtitle="Real-time categorized anti-cheat telemetry alerts requiring invigilator review"
          headerAction={<Bell className="w-5 h-5 text-amber-500" />}
        >
          <div className="space-y-4">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  alt.severity === 'CRITICAL'
                    ? 'bg-red-50/80 border-red-200 text-red-950'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    alt.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{alt.category}</span>
                      <Badge variant={alt.severity === 'CRITICAL' ? 'danger' : 'warning'} size="sm">
                        {alt.severity}
                      </Badge>
                      <span className="text-xs font-mono text-slate-500">[{alt.timestamp}]</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-800 mt-1">
                      Student: <span className="font-bold text-primary">{alt.student}</span> ({alt.candidateId}) • Station: <span className="font-mono">{alt.terminalId}</span>
                    </div>

                    <div className="text-xs text-slate-700 mt-1 bg-white/60 p-1.5 rounded border border-slate-200/60 font-medium">
                      Recommended Action: {alt.recommendedAction}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="warning"
                    size="sm"
                    icon={Send}
                    onClick={() => {
                      const matched = allCandidates.find(c => c.name === alt.student);
                      if (matched) handleOpenMessaging(matched, 'WARNING');
                    }}
                  >
                    Issue Warning
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => {
                      const matched = allCandidates.find(c => c.name === alt.student);
                      if (matched) setSelectedCandidate(matched);
                    }}
                  >
                    Inspect Candidate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ==================================================== */}
      {/* TAB 4: INCIDENT MANAGEMENT */}
      {/* ==================================================== */}
      {activeTab === 'INCIDENTS' && (
        <Card
          title="Incident Management Ledger"
          subtitle="Audit log of flagged candidate violations, resolution states, and assigned invigilator signatures"
          headerAction={<FileText className="w-5 h-5 text-primary" />}
        >
          <Table headers={["Timestamp", "Student & ID", "Violation Type", "Description & Evidence", "Assigned Invigilator", "Status", "Actions"]}>
            {incidents.map((inc) => (
              <tr key={inc.id} className="hover:bg-surface-bright transition-colors text-xs">
                <td className="px-4 py-3 font-mono text-on-surface-variant">{inc.time}</td>
                <td className="px-4 py-3">
                  <div className="font-bold text-on-surface">{inc.student}</div>
                  <div className="text-[10px] text-on-surface-variant font-mono">{inc.candidateId}</div>
                </td>
                <td className="px-4 py-3 font-semibold text-red-700">{inc.alertType}</td>
                <td className="px-4 py-3">
                  <div className="text-on-surface">{inc.description}</div>
                  <div className="text-[10px] font-mono text-primary mt-0.5">Evidence: {inc.evidence}</div>
                </td>
                <td className="px-4 py-3 font-medium text-on-surface-variant">{inc.assignedInvigilator}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      inc.status === 'New' ? 'danger' :
                      inc.status === 'Acknowledged' ? 'warning' :
                      inc.status === 'Resolved' ? 'success' : 'info'
                    }
                    size="sm"
                  >
                    {inc.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateIncidentStatus(inc.id, 'Acknowledged')}
                      title="Acknowledge Incident"
                    >
                      Ack
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateIncidentStatus(inc.id, 'Resolved')}
                      title="Mark Resolved"
                    >
                      Resolve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateIncidentStatus(inc.id, 'Escalated')}
                      title="Escalate to Chief Invigilator"
                    >
                      Escalate
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* ==================================================== */}
      {/* TAB 5: VISUAL ANALYTICS */}
      {/* ==================================================== */}
      {activeTab === 'ANALYTICS' && (
        <Card
          title="Control Room Visual Analytics"
          subtitle="Real-time infraction distribution, identity verification metrics, and hourly incident trends"
          headerAction={<BarChart3 className="w-5 h-5 text-primary" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Alert Distribution Chart */}
            <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Alert Distribution</span>
                <span className="text-[11px] font-mono font-bold text-primary">51 Total Alerts</span>
              </div>
              <div className="space-y-2.5">
                {analytics.alertDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{item.label}</span>
                      <span className="font-mono font-bold text-on-surface-variant">{item.count} alerts ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Status Breakdown */}
            <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Biometric Verification Ratio</span>
                <span className="text-[11px] font-mono font-bold text-emerald-600">98.2% Verified</span>
              </div>
              <div className="space-y-3">
                {analytics.verificationStatus.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{item.label}</span>
                      <span className="font-mono font-bold text-on-surface-variant">{item.count} candidates ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Connectivity */}
            <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Terminal Connectivity Telemetry</span>
                <span className="text-[11px] font-mono font-bold text-blue-600">450 Stations</span>
              </div>
              <div className="space-y-3">
                {analytics.connectivityStatus.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{item.label}</span>
                      <span className="font-mono font-bold text-on-surface-variant">{item.count} terminals ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hourly Incident Trend Curve */}
            <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Hourly Incident Trend</span>
                <span className="text-[11px] font-mono font-bold text-purple-600">Peak: 10:30 AM</span>
              </div>
              <div className="h-28 w-full flex items-end justify-between gap-2 pt-4 pb-1">
                {analytics.hourlyIncidentTrend.map((pt, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      className="w-full bg-purple-500/80 group-hover:bg-purple-600 rounded-t transition-all"
                      style={{ height: `${(pt.incidents / 15) * 100}%` }}
                    />
                    <span className="text-[9px] font-mono text-on-surface-variant">{pt.time}</span>
                    <div className="absolute -top-7 hidden group-hover:block bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-10 font-mono whitespace-nowrap">
                      {pt.incidents} incidents
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Card>
      )}

      {/* ==================================================== */}
      {/* 4. STUDENT DETAILS DRAWER (SLIDE-OVER / MODAL) */}
      {/* ==================================================== */}
      {selectedCandidate && (
        <Modal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          title={`Candidate Live Feed: ${selectedCandidate.name}`}
          icon={Eye}
          iconBg="bg-indigo-100 text-indigo-700"
          maxWidth="max-w-4xl"
          footer={
            <div className="flex justify-end w-full">
              <Button variant="outline" size="sm" icon={XCircle} onClick={() => setSelectedCandidate(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden relative shadow-md">
              <LiveFeedFrame
                candidate={{
                  ...inspectedCandidateFeed,
                  micActive: true,
                  screenShareActive: true,
                  internetStatus: 'CONNECTED'
                }}
                allowSnapshotFallback={false}
                frameUrl={inspectedCandidateFeed?.frameUrl}
                title="Selected Candidate Live Feed"
                subtitle={`REG: ${inspectedCandidateFeed?.candidateId} • SEAT: ${inspectedCandidateFeed?.seat} • ${inspectedCandidateFeed?.terminalId}`}
                className="aspect-video"
              />
            </div>
          </div>
        </Modal>
      )}

      {isMessagingOpen && (
        <Modal
          isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        title={`Dispatch Candidate Communication: ${messageRecipient?.name || 'Selected Candidate'}`}
        icon={Send}
        iconBg="bg-amber-100 text-amber-700"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsMessagingOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={Send}
              onClick={() => {
                issueWarning(messageRecipient?.name || 'Candidate', customMsgText);
                setIsMessagingOpen(false);
                alert(`Direct notification dispatched to candidate terminal ${messageRecipient?.terminalId || ''}`);
              }}
            >
              Dispatch Message
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Communication Template</label>
            <Select
              value={messageType}
              onChange={(e) => {
                const val = e.target.value;
                setMessageType(val);
                setCustomMsgText(
                  val === 'WARNING' ? 'Official Warning: Maintain continuous eye contact with your webcam.' :
                  val === 'REMINDER' ? 'Reminder: 30 minutes remaining in the examination session.' :
                  val === 'ATTENTION' ? 'Attention Candidate: Please adjust your webcam angle to clarify face visibility.' :
                  'Technical Support dispatch queued for your terminal station.'
                );
              }}
            >
              <option value="WARNING">Send Official Anti-Cheat Warning</option>
              <option value="REMINDER">Send Time & Exam Reminder</option>
              <option value="ATTENTION">Request Candidate Attention</option>
              <option value="TECH_DISPATCH">Notify Technical Support Desk</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Custom Note / Banner Text</label>
            <textarea
              rows={4}
              value={customMsgText}
              onChange={(e) => setCustomMsgText(e.target.value)}
              className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-xs"
            />
          </div>
        </div>
      </Modal>
      )}

      {/* MODAL 6: REASSIGN SEAT */}
      <Modal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        title={`Reassign Terminal Seat: ${selectedCandidate?.name || ''}`}
        icon={UserCog}
        iconBg="bg-indigo-100 text-indigo-700"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsReassignModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (selectedCandidate && reassignSeatValue) {
                  reassignCandidateSeat(selectedCandidate.id, reassignSeatValue);
                  setIsReassignModalOpen(false);
                  alert(`Reassigned ${selectedCandidate.name} to ${reassignSeatValue}`);
                }
              }}
            >
              Confirm Reassignment
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-on-surface-variant">
            Reassign candidate station from <span className="font-bold text-on-surface">{selectedCandidate?.seat}</span> to a new available hall terminal:
          </p>
          <Input
            label="New Target Station / Desk"
            placeholder="e.g. Lab 02 - Station 19"
            value={reassignSeatValue}
            onChange={(e) => setReassignSeatValue(e.target.value)}
          />
        </div>
      </Modal>

    </div>
  );
}
