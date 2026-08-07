import React, { useState, useMemo } from 'react';
import { Card } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import { Badge } from '../shared/components/ui/Badge';
import { Table } from '../shared/components/ui/Table';

import { INITIAL_SESSIONS, MOCK_CENTERS, MOCK_ROOMS } from '../services/mockSessions';
import { SessionCalendarView } from '../shared/components/sessions/SessionCalendarView';
import { SessionDetailsWorkspace } from '../shared/components/sessions/SessionDetailsWorkspace';
import { AssignInvigilatorModal } from '../shared/components/sessions/AssignInvigilatorModal';
import { SessionFormModal } from '../shared/components/sessions/SessionFormModal';
import { AssignSessionModal } from '../shared/components/students/AssignSessionModal';

import {
  Calendar,
  Building,
  Clock,
  UserCheck,
  Users,
  Plus,
  Search,
  RotateCcw,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertTriangle,
  Download,
  Grid,
  Layers
} from 'lucide-react';

export function SessionManagementPage() {
  // Main Data State
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  // View Mode: 'table' | 'calendar'
  const [viewMode, setViewMode] = useState('table');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [centerFilter, setCenterFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState('All');

  // Sorting
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Workspace & Modals State
  const [selectedSessionForWorkspace, setSelectedSessionForWorkspace] = useState(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const [sessionForInvigilatorModal, setSessionForInvigilatorModal] = useState(null);
  const [isInvigilatorModalOpen, setIsInvigilatorModalOpen] = useState(false);

  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [sessionForStudentAssign, setSessionForStudentAssign] = useState(null);
  const [isStudentAssignModalOpen, setIsStudentAssignModalOpen] = useState(false);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch =
        session.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.center.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.assignedInvigilator.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || session.status === statusFilter;
      const matchesCenter = centerFilter === 'All' || session.center === centerFilter;
      const matchesRoom = roomFilter === 'All' || session.room === roomFilter;

      return matchesSearch && matchesStatus && matchesCenter && matchesRoom;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sessions, searchTerm, statusFilter, centerFilter, roomFilter, sortField, sortDirection]);

  // Paginated Sessions
  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSessions.slice(start, start + itemsPerPage);
  }, [filteredSessions, currentPage]);

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage) || 1;

  // Actions
  const handleOpenWorkspace = (session) => {
    setSelectedSessionForWorkspace(session);
    setIsWorkspaceOpen(true);
  };

  const handleOpenEdit = (session) => {
    setSessionToEdit(session);
    setIsFormModalOpen(true);
  };

  const handleOpenCreate = () => {
    setSessionToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenInvigilatorModal = (session) => {
    setSessionForInvigilatorModal(session);
    setIsInvigilatorModalOpen(true);
  };

  const handleConfirmInvigilatorAssignment = (sessionCode, invigilatorName) => {
    setSessions(prev =>
      prev.map(s => (s.code === sessionCode ? { ...s, assignedInvigilator: invigilatorName } : s))
    );
    if (selectedSessionForWorkspace && selectedSessionForWorkspace.code === sessionCode) {
      setSelectedSessionForWorkspace(prev => ({ ...prev, assignedInvigilator: invigilatorName }));
    }
  };

  const handleSaveSession = (savedData) => {
    if (sessionToEdit) {
      setSessions(prev => prev.map(s => (s.code === savedData.code ? { ...s, ...savedData } : s)));
    } else {
      setSessions(prev => [
        {
          ...savedData,
          assignedStudentsCount: 0,
          roster: [],
          timeline: [{ event: 'Session Created & Scheduled', time: new Date().toISOString(), user: 'Admin' }]
        },
        ...prev
      ]);
    }
  };

  const handleDeleteSession = (sessionCode) => {
    if (window.confirm(`Are you sure you want to cancel session ${sessionCode}?`)) {
      setSessions(prev => prev.filter(s => s.code !== sessionCode));
      if (selectedSessionForWorkspace && selectedSessionForWorkspace.code === sessionCode) {
        setIsWorkspaceOpen(false);
      }
    }
  };

  const handleExportRoster = (session) => {
    alert(`Exporting candidate roster CSV for session ${session.code} (${session.examName}).`);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setCenterFilter('All');
    setRoomFilter('All');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">Active Live</Badge>;
      case 'Scheduled':
        return <Badge variant="info">Scheduled</Badge>;
      case 'Completed':
        return <Badge variant="mono">Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-on-surface">Assessment Sessions & Hall Management</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Exam scheduling, testing center room allocation, invigilator assignments, and 2D seat map management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Switcher Buttons */}
          <div className="flex items-center p-1 bg-surface-bright rounded-lg border border-outline-variant text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'table' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table View</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'calendar' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar View</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create Session
          </Button>
        </div>
      </div>

      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Total Sessions
          </div>
          <div className="text-2xl font-black text-on-surface font-mono">24</div>
          <div className="text-[10px] text-on-surface-variant">Across 4 assessment centers</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Active Live
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">4</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Live invigilator supervision</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
            Scheduled
          </div>
          <div className="text-2xl font-black text-primary font-mono">14</div>
          <div className="text-[10px] text-on-surface-variant">Rosters locked</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Completed
          </div>
          <div className="text-2xl font-black text-on-surface-variant font-mono">6</div>
          <div className="text-[10px] text-on-surface-variant">Archived & graded</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Available Capacity
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">1,420</div>
          <div className="text-[10px] text-on-surface-variant">Total available hall seats</div>
        </div>
      </div>

      {/* CALENDAR VIEW */}
      {viewMode === 'calendar' ? (
        <SessionCalendarView
          sessions={sessions}
          onSelectSession={handleOpenWorkspace}
        />
      ) : (
        /* TABLE VIEW */
        <div className="space-y-4">
          {/* Search & Filters */}
          <Card className="shadow-xs">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  label="Search Session"
                  placeholder="Code, Exam Name, Room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Select
                  label="Session Status"
                  options={['All', 'Active', 'Scheduled', 'Completed', 'Cancelled']}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />

                <Select
                  label="Testing Center"
                  options={['All', ...MOCK_CENTERS]}
                  value={centerFilter}
                  onChange={(e) => setCenterFilter(e.target.value)}
                />

                <Select
                  label="Room / Hall"
                  options={['All', ...MOCK_ROOMS]}
                  value={roomFilter}
                  onChange={(e) => setRoomFilter(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/60">
                <div className="text-on-surface-variant font-medium">
                  Showing <strong className="text-on-surface">{filteredSessions.length}</strong> session(s)
                </div>

                {(searchTerm || statusFilter !== 'All' || centerFilter !== 'All' || roomFilter !== 'All') && (
                  <button
                    onClick={handleResetFilters}
                    className="text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>
          </Card>

          {/* Sessions Data Table */}
          <Table
            headers={[
              'Session Code',
              'Exam Name',
              'Center',
              'Room',
              'Date',
              'Start Time',
              'End Time',
              'Capacity',
              'Assigned',
              'Invigilator',
              'Status',
              'Actions'
            ]}
          >
            {paginatedSessions.length > 0 ? (
              paginatedSessions.map((session) => (
                <tr key={session.code} className="hover:bg-surface-bright/80 transition-colors">
                  {/* Code */}
                  <td className="px-4 py-3 font-mono text-xs font-bold text-primary">
                    <button
                      onClick={() => handleOpenWorkspace(session)}
                      className="hover:underline text-left"
                    >
                      {session.code}
                    </button>
                  </td>

                  {/* Exam Name */}
                  <td className="px-4 py-3 font-bold text-xs text-on-surface max-w-xs truncate">
                    {session.examName}
                  </td>

                  {/* Center */}
                  <td className="px-4 py-3 text-xs text-on-surface-variant max-w-xs truncate">
                    {session.center}
                  </td>

                  {/* Room */}
                  <td className="px-4 py-3 font-semibold text-xs text-on-surface">
                    {session.room}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 font-mono text-xs text-on-surface">
                    {session.date}
                  </td>

                  {/* Start Time */}
                  <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">
                    {session.startTime}
                  </td>

                  {/* End Time */}
                  <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">
                    {session.endTime}
                  </td>

                  {/* Capacity */}
                  <td className="px-4 py-3 font-mono text-xs font-bold text-on-surface">
                    {session.capacity}
                  </td>

                  {/* Assigned Students */}
                  <td className="px-4 py-3 text-xs font-mono">
                    <span className="font-bold text-primary">
                      {session.assignedStudentsCount || session.roster?.length || 0}
                    </span>
                    <span className="text-on-surface-variant"> / {session.capacity}</span>
                  </td>

                  {/* Invigilator */}
                  <td className="px-4 py-3 text-xs font-semibold text-on-surface">
                    {session.assignedInvigilator}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-xs">
                    {getStatusBadge(session.status)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenWorkspace(session)}
                        className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                        title="Open Session Workspace"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(session)}
                        className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                        title="Edit Session"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenInvigilatorModal(session)}
                        className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                        title="Assign Invigilator"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteSession(session.code)}
                        className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-red-600 transition-colors"
                        title="Delete Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-xs text-on-surface-variant">
                  No sessions match your search or filter criteria.
                </td>
              </tr>
            )}
          </Table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2">
            <div>
              Page <strong className="text-on-surface font-mono">{currentPage}</strong> of{' '}
              <strong className="text-on-surface font-mono">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={ChevronLeft}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                icon={ChevronRight}
                iconPosition="right"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Session Details Workspace */}
      <SessionDetailsWorkspace
        session={selectedSessionForWorkspace}
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
        onEditSession={handleOpenEdit}
        onAssignInvigilator={handleOpenInvigilatorModal}
        onAssignStudents={(sec) => {
          setSessionForStudentAssign(sec);
          setIsStudentAssignModalOpen(true);
        }}
        onExportRoster={handleExportRoster}
        onDeleteSession={handleDeleteSession}
      />

      {/* Invigilator Assignment Modal */}
      <AssignInvigilatorModal
        isOpen={isInvigilatorModalOpen}
        onClose={() => setIsInvigilatorModalOpen(false)}
        session={sessionForInvigilatorModal}
        onConfirmAssignment={handleConfirmInvigilatorAssignment}
      />

      {/* Session Form Modal (Create / Edit) */}
      <SessionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        sessionToEdit={sessionToEdit}
        onSave={handleSaveSession}
      />

      {/* Assign Students Modal */}
      <AssignSessionModal
        isOpen={isStudentAssignModalOpen}
        onClose={() => setIsStudentAssignModalOpen(false)}
        targetStudents={sessionForStudentAssign?.roster || []}
        onConfirmAssignment={(studentIds, sessionCode) => {
          alert(`Assigned ${studentIds.length} candidate(s) to session ${sessionCode}`);
        }}
      />
    </div>
  );
}
