import React, { useState, useMemo } from 'react';
import { Card } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import { Badge } from '../shared/components/ui/Badge';
import { Table } from '../shared/components/ui/Table';
import { ProgressBar } from '../shared/components/ui/ProgressBar';

import { useCandidates } from '../hooks/useCandidates';
import { StudentDetailsDrawer } from '../shared/components/students/StudentDetailsDrawer';
import { AssignSessionModal } from '../shared/components/students/AssignSessionModal';
import { StudentFormModal } from '../shared/components/students/StudentFormModal';
import { ResetCredentialsModal } from '../shared/components/students/ResetCredentialsModal';

import { Users, Building, Plus, RotateCcw, Eye, Edit, KeyRound, UserX, ChevronLeft, ChevronRight, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentsListPage() {
  const { candidates: students, isLoading, refresh } = useCandidates();

  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [registrationFilter, setRegistrationFilter] = useState('All');
  const [sessionFilter, setSessionFilter] = useState('All');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAssignSessionOpen, setIsAssignSessionOpen] = useState(false);
  const [assignTargetStudents, setAssignTargetStudents] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [isResetCredentialsOpen, setIsResetCredentialsOpen] = useState(false);
  const [studentForReset, setStudentForReset] = useState(null);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch =
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.candidateId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesVerification = verificationFilter === 'All' || student.verificationStatus === verificationFilter;
      const matchesRegistration = registrationFilter === 'All' || student.registrationStatus === registrationFilter;
      const matchesSession = sessionFilter === 'All' || student.session === sessionFilter;

      return matchesSearch && matchesVerification && matchesRegistration && matchesSession;
    });
  }, [students, searchTerm, verificationFilter, registrationFilter, sessionFilter]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;

  if (isLoading) return <div className="p-8 text-center animate-pulse text-on-surface-variant">Loading candidates from live database...</div>;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-on-surface">Registered Students</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Manage the complete roster of candidates registered for examinations.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/admin/candidates/import">
            <Button variant="outline" size="sm">Bulk Import</Button>
          </Link>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsFormModalOpen(true)}>Add Candidate</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Candidates</div>
            <div className="text-2xl font-black text-on-surface font-mono">{students.length}</div>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-xl"><Users className="w-6 h-6" /></div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Verified</div>
            <div className="text-2xl font-black text-emerald-600 font-mono">{students.filter(s=>s.verificationStatus==='Verified').length}</div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Pending Review</div>
            <div className="text-2xl font-black text-amber-600 font-mono">{students.filter(s=>s.verificationStatus==='Pending').length}</div>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl"><Clock className="w-6 h-6" /></div>
        </div>
      </div>

      <Card className="shadow-xs">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="md:col-span-1">
              <Input label="Search Student" placeholder="ID, Name, Email..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            </div>
            <Select label="Verification Status" options={['All', 'Verified', 'Pending', 'Rejected']} value={verificationFilter} onChange={(e) => { setVerificationFilter(e.target.value); setCurrentPage(1); }} />
            <Select label="Registration Status" options={['All', 'Completed', 'Pending']} value={registrationFilter} onChange={(e) => { setRegistrationFilter(e.target.value); setCurrentPage(1); }} />
            <Select label="Assigned Session" options={['All', 'Unassigned']} value={sessionFilter} onChange={(e) => { setSessionFilter(e.target.value); setCurrentPage(1); }} />
          </div>
        </div>
      </Card>

      <Table headers={['Student ID', 'Candidate Name', 'Email Address', 'Verification', 'Status', 'Actions']}>
        {paginatedStudents.length > 0 ? (
          paginatedStudents.map((student) => (
            <tr key={student.id} className="hover:bg-surface-bright/80 transition-colors">
              <td className="px-4 py-3 font-mono text-xs font-bold text-primary">{student.candidateId}</td>
              <td className="px-4 py-3">
                <div onClick={() => { setSelectedStudentForDrawer(student); setIsDrawerOpen(true); }} className="flex items-center gap-2.5 cursor-pointer group">
                  <div className={`w-8 h-8 rounded-full ${student.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {student.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">{student.name}</div>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{student.email}</td>
              <td className="px-4 py-3 text-xs"><Badge variant={student.verificationStatus === 'Verified' ? 'success' : 'warning'}>{student.verificationStatus}</Badge></td>
              <td className="px-4 py-3 text-xs"><Badge variant="info">{student.registrationStatus}</Badge></td>
              <td className="px-4 py-3 text-xs">
                <div className="flex items-center gap-1">
                  <button onClick={() => { setSelectedStudentForDrawer(student); setIsDrawerOpen(true); }} className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"><Eye className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-on-surface-variant">No candidate records match criteria.</td></tr>
        )}
      </Table>
      
      <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2">
        <div>Page <strong className="text-on-surface font-mono">{currentPage}</strong> of <strong className="text-on-surface font-mono">{totalPages}</strong></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={ChevronLeft} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</Button>
          <Button variant="outline" size="sm" icon={ChevronRight} iconPosition="right" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</Button>
        </div>
      </div>

      <StudentDetailsDrawer student={selectedStudentForDrawer} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <AssignSessionModal isOpen={isAssignSessionOpen} onClose={() => setIsAssignSessionOpen(false)} targetStudents={assignTargetStudents} />
      <StudentFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} studentToEdit={studentToEdit} onSave={refresh} />
      <ResetCredentialsModal isOpen={isResetCredentialsOpen} onClose={() => setIsResetCredentialsOpen(false)} student={studentForReset} />
    </div>
  );
}
