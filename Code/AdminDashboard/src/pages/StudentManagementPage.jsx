import React, { useState, useMemo } from 'react';
import { Card } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import { Badge } from '../shared/components/ui/Badge';
import { Table } from '../shared/components/ui/Table';
import { ProgressBar } from '../shared/components/ui/ProgressBar';

import { INITIAL_STUDENTS, MOCK_EXAM_SESSIONS } from '../services/mockStudents';
import { StudentDetailsDrawer } from '../shared/components/students/StudentDetailsDrawer';
import { BulkImportModal } from '../shared/components/students/BulkImportModal';
import { AssignSessionModal } from '../shared/components/students/AssignSessionModal';
import { StudentFormModal } from '../shared/components/students/StudentFormModal';
import { ResetCredentialsModal } from '../shared/components/students/ResetCredentialsModal';

import {
  Users,
  UserCheck,
  Clock,
  Building,
  Plus,
  FileSpreadsheet,
  Search,
  Filter,
  RotateCcw,
  Eye,
  Edit,
  KeyRound,
  UserX,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2
} from 'lucide-react';

export function StudentManagementPage() {
  // Main Data State
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  // Selection & Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [registrationFilter, setRegistrationFilter] = useState('All');
  const [sessionFilter, setSessionFilter] = useState('All');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Drawer & Modal State
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isAssignSessionOpen, setIsAssignSessionOpen] = useState(false);
  const [assignTargetStudents, setAssignTargetStudents] = useState([]);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  const [isResetCredentialsOpen, setIsResetCredentialsOpen] = useState(false);
  const [studentForReset, setStudentForReset] = useState(null);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm);

      const matchesVerification =
        verificationFilter === 'All' || student.verificationStatus === verificationFilter;

      const matchesRegistration =
        registrationFilter === 'All' || student.registrationStatus === registrationFilter;

      const matchesSession =
        sessionFilter === 'All' || student.session === sessionFilter;

      return matchesSearch && matchesVerification && matchesRegistration && matchesSession;
    });
  }, [students, searchTerm, verificationFilter, registrationFilter, sessionFilter]);

  // Paginated Students
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;

  // Selection Checkbox Logic
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudentIds(paginatedStudents.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleOpenDrawer = (student) => {
    setSelectedStudentForDrawer(student);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (student) => {
    setStudentToEdit(student);
    setIsFormModalOpen(true);
  };

  const handleOpenAdd = () => {
    setStudentToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenAssignSessionSingle = (student) => {
    setAssignTargetStudents([student]);
    setIsAssignSessionOpen(true);
  };

  const handleOpenAssignSessionBulk = () => {
    const targets = students.filter(s => selectedStudentIds.includes(s.id));
    setAssignTargetStudents(targets);
    setIsAssignSessionOpen(true);
  };

  const handleConfirmSessionAssignment = (studentIds, newSession) => {
    setStudents(prev =>
      prev.map(s => (studentIds.includes(s.id) ? { ...s, session: newSession } : s))
    );
    // Update drawer student if open
    if (selectedStudentForDrawer && studentIds.includes(selectedStudentForDrawer.id)) {
      setSelectedStudentForDrawer(prev => ({ ...prev, session: newSession }));
    }
    setSelectedStudentIds([]);
  };

  const handleOpenResetCredentials = (student) => {
    setStudentForReset(student);
    setIsResetCredentialsOpen(true);
  };

  const handleToggleRegistrationStatus = (student) => {
    const newStatus = student.registrationStatus === 'Active' ? 'Deactivated' : 'Active';
    setStudents(prev =>
      prev.map(s => (s.id === student.id ? { ...s, registrationStatus: newStatus } : s))
    );
    if (selectedStudentForDrawer && selectedStudentForDrawer.id === student.id) {
      setSelectedStudentForDrawer(prev => ({ ...prev, registrationStatus: newStatus }));
    }
  };

  const handleSaveStudent = (savedData) => {
    if (studentToEdit) {
      setStudents(prev => prev.map(s => (s.id === savedData.id ? { ...s, ...savedData } : s)));
    } else {
      setStudents(prev => [
        {
          ...savedData,
          avatar: savedData.name.substring(0, 2).toUpperCase(),
          faceMatchScore: 95.0,
          verificationTimeline: [{ step: 'Registered', time: new Date().toISOString(), status: 'Passed' }],
          activityTimeline: [],
          notes: []
        },
        ...prev
      ]);
    }
  };

  const handleAddNoteToStudent = (studentId, noteText) => {
    const newNote = {
      author: 'Admin Proctor',
      date: new Date().toISOString().split('T')[0],
      text: noteText
    };
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, notes: [newNote, ...(s.notes || [])] } : s))
    );
    if (selectedStudentForDrawer && selectedStudentForDrawer.id === studentId) {
      setSelectedStudentForDrawer(prev => ({
        ...prev,
        notes: [newNote, ...(prev.notes || [])]
      }));
    }
  };

  const handleBulkImportSuccess = (newRecords) => {
    setStudents(prev => [...newRecords, ...prev]);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setVerificationFilter('All');
    setRegistrationFilter('All');
    setSessionFilter('All');
  };

  // Helper badge renders
  const getVerificationBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="success">Verified</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getRegistrationBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge variant="info">Active</Badge>;
      case 'Inactive':
        return <Badge variant="mono">Inactive</Badge>;
      case 'Deactivated':
        return <Badge variant="danger">Deactivated</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-on-surface">Candidate & Student Management</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Roster management, biometric identity verification, session assignments, and account controls.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={FileSpreadsheet}
            onClick={() => setIsBulkImportOpen(true)}
          >
            Bulk Import CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenAdd}
          >
            Add Candidate
          </Button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Total Candidates
            </div>
            <div className="text-2xl font-black text-on-surface font-mono">1,280</div>
            <div className="text-[11px] text-emerald-600 font-semibold">+12% from last batch</div>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Biometric Verified
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono">1,120</div>
            <div className="text-[11px] text-on-surface-variant font-medium">87.5% verification rate</div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Pending Review
            </div>
            <div className="text-2xl font-black text-amber-600 font-mono">110</div>
            <div className="text-[11px] text-amber-600 font-semibold">Requires invigilator review</div>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Session Assigned
            </div>
            <div className="text-2xl font-black text-primary font-mono">1,050</div>
            <div className="text-[11px] text-on-surface-variant font-medium">Mapped to exam halls</div>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl">
            <Building className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <Card className="shadow-xs">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="md:col-span-1">
              <Input
                label="Search Student"
                placeholder="ID, Name, Email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Verification Status Filter */}
            <Select
              label="Verification Status"
              options={['All', 'Verified', 'Pending', 'Rejected']}
              value={verificationFilter}
              onChange={(e) => {
                setVerificationFilter(e.target.value);
                setCurrentPage(1);
              }}
            />

            {/* Registration Status Filter */}
            <Select
              label="Registration Status"
              options={['All', 'Active', 'Inactive', 'Deactivated']}
              value={registrationFilter}
              onChange={(e) => {
                setRegistrationFilter(e.target.value);
                setCurrentPage(1);
              }}
            />

            {/* Exam Session Filter */}
            <Select
              label="Assigned Session"
              options={['All', ...MOCK_EXAM_SESSIONS]}
              value={sessionFilter}
              onChange={(e) => {
                setSessionFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-outline-variant/60 text-xs">
            <div className="text-on-surface-variant font-medium">
              Showing <strong className="text-on-surface">{filteredStudents.length}</strong> candidate record(s)
            </div>

            {(searchTerm || verificationFilter !== 'All' || registrationFilter !== 'All' || sessionFilter !== 'All') && (
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

      {/* Bulk Action Bar (Visible when rows checked) */}
      {selectedStudentIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-primary text-on-primary shadow-md flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{selectedStudentIds.length} candidate(s) selected</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Building}
              onClick={handleOpenAssignSessionBulk}
            >
              Bulk Assign Session
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => alert(`Exporting ${selectedStudentIds.length} candidate profiles to CSV.`)}
              className="bg-white text-slate-900 border-white hover:bg-slate-100"
            >
              Export CSV
            </Button>

            <button
              onClick={() => setSelectedStudentIds([])}
              className="text-xs text-on-primary/80 hover:text-white font-medium underline pl-2"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Student Data Table */}
      <Table
        headers={[
          <input
            type="checkbox"
            checked={
              paginatedStudents.length > 0 &&
              paginatedStudents.every(s => selectedStudentIds.includes(s.id))
            }
            onChange={handleSelectAll}
            className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
          />,
          'Student ID',
          'Candidate Name',
          'Email Address',
          'Phone',
          'Assigned Session',
          'Verification',
          'Face Match',
          'Status',
          'Actions'
        ]}
      >
        {paginatedStudents.length > 0 ? (
          paginatedStudents.map((student) => {
            const isSelected = selectedStudentIds.includes(student.id);
            return (
              <tr
                key={student.id}
                className={`hover:bg-surface-bright/80 transition-colors ${
                  isSelected ? 'bg-primary/5' : ''
                }`}
              >
                {/* Checkbox */}
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectOne(student.id)}
                    className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                  />
                </td>

                {/* Student ID */}
                <td className="px-4 py-3 font-mono text-xs font-bold text-primary">
                  {student.id}
                </td>

                {/* Name & Avatar */}
                <td className="px-4 py-3">
                  <div
                    onClick={() => handleOpenDrawer(student)}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {student.avatar || student.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                        {student.name}
                      </div>
                      <div className="text-[10px] text-on-surface-variant font-mono">
                        {student.enrollmentNo}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">
                  {student.email}
                </td>

                {/* Phone */}
                <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">
                  {student.phone}
                </td>

                {/* Session */}
                <td className="px-4 py-3 text-xs">
                  <span className={`font-semibold ${
                    student.session === 'Unassigned' ? 'text-amber-600' : 'text-on-surface'
                  }`}>
                    {student.session}
                  </span>
                </td>

                {/* Verification Status */}
                <td className="px-4 py-3 text-xs">
                  {getVerificationBadge(student.verificationStatus)}
                </td>

                {/* Face Match Score */}
                <td className="px-4 py-3 text-xs">
                  <div className="w-24 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono font-bold">
                      <span className={
                        student.faceMatchScore >= 85 ? 'text-emerald-700' : 'text-amber-700'
                      }>
                        {student.faceMatchScore}%
                      </span>
                    </div>
                    <ProgressBar
                      progress={student.faceMatchScore}
                      color={student.faceMatchScore >= 85 ? 'bg-emerald-600' : 'bg-amber-500'}
                    />
                  </div>
                </td>

                {/* Registration Status */}
                <td className="px-4 py-3 text-xs">
                  {getRegistrationBadge(student.registrationStatus)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenDrawer(student)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(student)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                      title="Edit Student"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenResetCredentials(student)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                      title="Reset Password"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenAssignSessionSingle(student)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                      title="Assign Session"
                    >
                      <Building className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleRegistrationStatus(student)}
                      className={`p-1.5 rounded hover:bg-surface-container-high transition-colors ${
                        student.registrationStatus === 'Active'
                          ? 'text-on-surface-variant hover:text-red-600'
                          : 'text-emerald-600 hover:text-emerald-700'
                      }`}
                      title={student.registrationStatus === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={10} className="px-4 py-8 text-center text-xs text-on-surface-variant">
              No candidate records match your search or filter criteria.
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

      {/* Slide-over Details Drawer */}
      <StudentDetailsDrawer
        student={selectedStudentForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={handleOpenEdit}
        onAssignSession={handleOpenAssignSessionSingle}
        onResetPassword={handleOpenResetCredentials}
        onToggleStatus={handleToggleRegistrationStatus}
        onAddNote={handleAddNoteToStudent}
      />

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportSuccess={handleBulkImportSuccess}
      />

      {/* Assign Session Modal */}
      <AssignSessionModal
        isOpen={isAssignSessionOpen}
        onClose={() => setIsAssignSessionOpen(false)}
        targetStudents={assignTargetStudents}
        onConfirmAssignment={handleConfirmSessionAssignment}
      />

      {/* Student Form Modal (Add / Edit) */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        studentToEdit={studentToEdit}
        onSave={handleSaveStudent}
      />

      {/* Reset Credentials Modal */}
      <ResetCredentialsModal
        isOpen={isResetCredentialsOpen}
        onClose={() => setIsResetCredentialsOpen(false)}
        student={studentForReset}
      />
    </div>
  );
}
