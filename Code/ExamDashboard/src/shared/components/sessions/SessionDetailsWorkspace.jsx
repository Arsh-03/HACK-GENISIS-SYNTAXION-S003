import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Table } from '../ui/Table';
import { Input } from '../ui/Input';
import { ProgressBar } from '../ui/ProgressBar';
import { SessionSeatMap } from './SessionSeatMap';

import {
  X,
  Calendar,
  Building,
  UserCheck,
  Users,
  Grid,
  Clock,
  ShieldCheck,
  Download,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Monitor,
  Plus
} from 'lucide-react';

export function SessionDetailsWorkspace({
  session,
  isOpen,
  onClose,
  onEditSession,
  onAssignInvigilator,
  onAssignStudents,
  onExportRoster,
  onDeleteSession
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [rosterSearch, setRosterSearch] = useState('');

  if (!isOpen || !session) return null;

  const assignedCount = session.assignedStudentsCount || session.roster?.length || 0;
  const capacityPercent = Math.min(100, Math.round((assignedCount / session.capacity) * 100));

  // Filtered Roster
  const filteredRoster = (session.roster || []).filter(student =>
    student.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    student.id.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    student.seatNo?.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">Active Live</Badge>;
      case 'Scheduled':
        return <Badge variant="info">Scheduled</Badge>;
      case 'Completed':
        return <Badge variant="mono">Completed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Workspace Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-4xl bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col justify-between">
          
          {/* Top Workspace Header */}
          <div className="p-6 bg-surface-bright border-b border-outline-variant flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {session.code}
                  </span>
                  <h2 className="text-xl font-bold text-on-surface">{session.examName}</h2>
                  {getStatusBadge(session.status)}
                </div>
                <div className="text-xs text-on-surface-variant mt-0.5 font-mono">
                  {session.center} • {session.room} • {session.date} ({session.startTime} - {session.endTime})
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 bg-surface-bright border-b border-outline-variant flex gap-6 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Session Overview & Capacity
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'roster'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Assigned Student Roster ({assignedCount})
            </button>
            <button
              onClick={() => setActiveTab('seatmap')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'seatmap'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Interactive 2D Seat Map
            </button>
          </div>

          {/* Workspace Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Capacity Usage Card */}
                <div className="p-5 rounded-xl bg-surface-bright border border-outline-variant space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Examination Hall Seat Capacity Usage
                      </div>
                      <div className="text-2xl font-black text-on-surface font-mono mt-0.5">
                        {assignedCount} / {session.capacity} <span className="text-xs font-normal text-on-surface-variant font-sans">Seats Occupied ({capacityPercent}%)</span>
                      </div>
                    </div>
                    <Badge variant={capacityPercent >= 90 ? 'warning' : 'success'}>
                      {session.capacity - assignedCount} Seats Available
                    </Badge>
                  </div>

                  <ProgressBar
                    progress={capacityPercent}
                    color={capacityPercent >= 90 ? 'bg-amber-500' : 'bg-primary'}
                  />
                </div>

                {/* General & Room Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* General Info */}
                  <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-primary" /> Session Specifications
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-outline-variant/60 pb-1.5">
                        <span className="text-on-surface-variant">Session Code</span>
                        <span className="font-bold text-primary font-mono">{session.code}</span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/60 pb-1.5">
                        <span className="text-on-surface-variant">Exam Name</span>
                        <span className="font-semibold text-on-surface">{session.examName}</span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/60 pb-1.5">
                        <span className="text-on-surface-variant">Scheduled Date</span>
                        <span className="font-bold text-on-surface font-mono">{session.date}</span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/60 pb-1.5">
                        <span className="text-on-surface-variant">Time Slot</span>
                        <span className="font-bold text-on-surface font-mono">{session.startTime} - {session.endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Duration</span>
                        <span className="font-semibold text-on-surface font-mono">{session.durationMinutes || 180} mins</span>
                      </div>
                    </div>
                  </div>

                  {/* Room & Invigilator Info */}
                  <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-primary" /> Hall & Invigilator Assignment
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-outline-variant/60 pb-1.5">
                        <span className="text-on-surface-variant">Testing Center</span>
                        <span className="font-bold text-on-surface">{session.center}</span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/60 pb-1.5">
                        <span className="text-on-surface-variant">Assigned Room</span>
                        <span className="font-bold text-on-surface">{session.room}</span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/60 pb-1.5">
                        <span className="text-on-surface-variant">Supervising Invigilator</span>
                        <span className="font-bold text-primary">{session.assignedInvigilator}</span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/60 pb-1.5">
                        <span className="text-on-surface-variant">Terminal IP Security Lock</span>
                        <span className="font-mono text-emerald-600 font-bold">{session.ipSubnet || '192.168.10.0/24'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Proctor Status</span>
                        <span className="font-semibold text-emerald-600">Active Monitoring</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Timeline */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" /> Audit & Execution Timeline
                  </h3>
                  <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant space-y-3 text-xs">
                    {session.timeline?.length > 0 ? (
                      session.timeline.map((evt, idx) => (
                        <div key={idx} className="flex items-start justify-between border-b border-outline-variant/50 pb-2 last:border-0 last:pb-0">
                          <div>
                            <div className="font-bold text-on-surface">{evt.event}</div>
                            <div className="text-[10px] text-on-surface-variant">By {evt.user}</div>
                          </div>
                          <span className="font-mono text-[10px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                            {evt.time}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-on-surface-variant italic">No timeline events logged yet.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STUDENT ROSTER */}
            {activeTab === 'roster' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="w-full sm:w-64">
                    <Input
                      placeholder="Search Roster..."
                      value={rosterSearch}
                      onChange={(e) => setRosterSearch(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" icon={Plus} onClick={() => onAssignStudents(session)}>
                      Add Candidates
                    </Button>
                    <Button variant="outline" size="sm" icon={Download} onClick={() => onExportRoster(session)}>
                      Export Roster
                    </Button>
                  </div>
                </div>

                <Table headers={['Student ID', 'Candidate Name', 'Verification', 'Seat No.', 'Terminal ID', 'Attendance']}>
                  {filteredRoster.length > 0 ? (
                    filteredRoster.map((student, idx) => (
                      <tr key={idx} className="hover:bg-surface-bright/80 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-primary">{student.id}</td>
                        <td className="px-4 py-3 font-bold text-xs text-on-surface">{student.name}</td>
                        <td className="px-4 py-3 text-xs">
                          {student.verificationStatus === 'Verified' ? (
                            <Badge variant="success">Verified</Badge>
                          ) : student.verificationStatus === 'Pending' ? (
                            <Badge variant="warning">Pending</Badge>
                          ) : (
                            <Badge variant="danger">Rejected</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs font-bold text-on-surface">{student.seatNo || 'A-01'}</td>
                        <td className="px-4 py-3 font-mono text-xs text-primary">{student.terminalId || 'TERM-A-01'}</td>
                        <td className="px-4 py-3 text-xs">
                          <span className={`font-bold ${
                            student.attendanceStatus === 'Present'
                              ? 'text-emerald-600'
                              : student.attendanceStatus === 'Scheduled'
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}>
                            {student.attendanceStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-xs text-on-surface-variant">
                        No candidates currently assigned matching filter.
                      </td>
                    </tr>
                  )}
                </Table>
              </div>
            )}

            {/* TAB 3: SEAT MAP */}
            {activeTab === 'seatmap' && (
              <div>
                <SessionSeatMap session={session} />
              </div>
            )}
          </div>

          {/* Workspace Footer Actions */}
          <div className="p-4 bg-surface-bright border-t border-outline-variant flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={Edit}
                onClick={() => onEditSession(session)}
              >
                Edit Session
              </Button>

              <Button
                variant="outline"
                size="sm"
                icon={UserCheck}
                onClick={() => onAssignInvigilator(session)}
              >
                Assign Invigilator
              </Button>

              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={() => onExportRoster(session)}
              >
                Export Roster
              </Button>
            </div>

            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => onDeleteSession(session.code)}
            >
              Cancel Session
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
