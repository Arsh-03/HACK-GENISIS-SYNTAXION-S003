import React, { useState, useMemo } from 'react';
import { Card } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import { Badge } from '../shared/components/ui/Badge';
import { Table } from '../shared/components/ui/Table';

import {
  INITIAL_EXAMS,
  MOCK_CATEGORIES,
  MOCK_AVAILABLE_SUBJECTS
} from '../services/mockExams';

import { ExamBlueprintVisualizer } from '../shared/components/exams/ExamBlueprintVisualizer';
import { ExamDetailsDrawer } from '../shared/components/exams/ExamDetailsDrawer';
import { ExamWizardModal } from '../shared/components/exams/ExamWizardModal';

import {
  Grid,
  Plus,
  Sparkles,
  Search,
  RotateCcw,
  Eye,
  Edit,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  Award,
  ShieldCheck
} from 'lucide-react';

export function ExamBuilderPage() {
  // Main State
  const [exams, setExams] = useState(INITIAL_EXAMS);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Selection
  const [selectedExamCodes, setSelectedExamCodes] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Drawer & Wizard Modals State
  const [selectedExamForDrawer, setSelectedExamForDrawer] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const [examToEdit, setExamToEdit] = useState(null);
  const [isWizardModalOpen, setIsWizardModalOpen] = useState(false);

  // Filtered Exams
  const filteredExams = useMemo(() => {
    return exams.filter(e => {
      const matchesSearch =
        e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.createdBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
      const matchesSubject = subjectFilter === 'All' || e.subjects.includes(subjectFilter);

      return matchesSearch && matchesCategory && matchesStatus && matchesSubject;
    });
  }, [exams, searchTerm, categoryFilter, statusFilter, subjectFilter]);

  // Paginated Exams
  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExams.slice(start, start + itemsPerPage);
  }, [filteredExams, currentPage]);

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage) || 1;

  // Checkbox Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedExamCodes(paginatedExams.map(e => e.code));
    } else {
      setSelectedExamCodes([]);
    }
  };

  const handleSelectOne = (code) => {
    setSelectedExamCodes(prev =>
      prev.includes(code) ? prev.filter(item => item !== code) : [...prev, code]
    );
  };

  // Handlers
  const handleOpenDetails = (exam) => {
    setSelectedExamForDrawer(exam);
    setIsDetailsDrawerOpen(true);
  };

  const handleOpenEdit = (exam) => {
    setExamToEdit(exam);
    setIsWizardModalOpen(true);
  };

  const handleOpenCreateWizard = () => {
    setExamToEdit(null);
    setIsWizardModalOpen(true);
  };

  const handleDuplicateExam = (exam) => {
    const duplicated = {
      ...exam,
      code: `EXM-2026-0${Math.floor(100 + Math.random() * 900)}`,
      name: `${exam.name} (Copy)`,
      status: 'Draft',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setExams(prev => [duplicated, ...prev]);
  };

  const handleDeleteExam = (code) => {
    if (window.confirm(`Are you sure you want to delete exam blueprint ${code}?`)) {
      setExams(prev => prev.filter(e => e.code !== code));
      if (selectedExamForDrawer && selectedExamForDrawer.code === code) {
        setIsDetailsDrawerOpen(false);
      }
    }
  };

  const handleSaveExam = (savedData) => {
    if (examToEdit) {
      setExams(prev => prev.map(e => (e.code === savedData.code ? { ...e, ...savedData } : e)));
    } else {
      setExams(prev => [savedData, ...prev]);
    }
  };

  const handleGenerateAIPaper = () => {
    alert('Launching AI Exam Paper Synthesis Engine using Gemini LLM...');
    handleOpenCreateWizard();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setStatusFilter('All');
    setSubjectFilter('All');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-on-surface">Exam Creation & Blueprint Builder</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Multi-subject weightage calibration, difficulty distribution matrix, security policy controls, and paper authoring.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Button
            variant="secondary"
            size="sm"
            icon={Sparkles}
            onClick={handleGenerateAIPaper}
          >
            Generate AI Paper
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreateWizard}
          >
            Create Exam Wizard
          </Button>
        </div>
      </div>

      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Total Exams
          </div>
          <div className="text-2xl font-black text-on-surface font-mono">48</div>
          <div className="text-[10px] text-on-surface-variant">Created across sessions</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Published Exams
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">32</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Active in exam centers</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Draft Exams
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">8</div>
          <div className="text-[10px] text-on-surface-variant">Under review</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            AI Generated
          </div>
          <div className="text-2xl font-black text-indigo-600 font-mono">18</div>
          <div className="text-[10px] text-indigo-600 font-semibold">Synthesized papers</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
            Scheduled
          </div>
          <div className="text-2xl font-black text-primary font-mono">14</div>
          <div className="text-[10px] text-on-surface-variant">Upcoming time slots</div>
        </div>
      </div>

      {/* Blueprint Visualizer Breakdown */}
      <ExamBlueprintVisualizer
        blueprint={{
          subjectWeightage: [
            { subject: 'Computer Science', weightage: 50, questions: 25 },
            { subject: 'Artificial Intelligence', weightage: 30, questions: 15 },
            { subject: 'Mathematics', weightage: 20, questions: 10 }
          ],
          difficultyRatio: { easy: 40, medium: 40, hard: 20 }
        }}
        totalQuestions={50}
        totalMarks={100}
      />

      {/* Search & Filter Toolbar */}
      <Card className="shadow-xs">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Input
              label="Search Exam"
              placeholder="Code, Exam Title, Author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              label="Category"
              options={['All', ...MOCK_CATEGORIES]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />

            <Select
              label="Status"
              options={['All', 'Published', 'Draft', 'Archived']}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />

            <Select
              label="Subject"
              options={['All', ...MOCK_AVAILABLE_SUBJECTS]}
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/60">
            <div className="text-on-surface-variant font-medium">
              Showing <strong className="text-on-surface">{filteredExams.length}</strong> exam paper(s)
            </div>

            {(searchTerm || categoryFilter !== 'All' || statusFilter !== 'All' || subjectFilter !== 'All') && (
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

      {/* Main Exam Data Table */}
      <Table
        headers={[
          <input
            type="checkbox"
            checked={
              paginatedExams.length > 0 &&
              paginatedExams.every(e => selectedExamCodes.includes(e.code))
            }
            onChange={handleSelectAll}
            className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
          />,
          'Exam Code',
          'Exam Name',
          'Category',
          'Subjects',
          'Questions',
          'Total Marks',
          'Duration',
          'Status',
          'Created By',
          'Actions'
        ]}
      >
        {paginatedExams.length > 0 ? (
          paginatedExams.map((exam) => {
            const isSelected = selectedExamCodes.includes(exam.code);
            return (
              <tr key={exam.code} className={`hover:bg-surface-bright/80 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectOne(exam.code)}
                    className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                  />
                </td>

                <td className="px-4 py-3 font-mono text-xs font-bold text-primary">
                  <button onClick={() => handleOpenDetails(exam)} className="hover:underline text-left">
                    {exam.code}
                  </button>
                </td>

                <td className="px-4 py-3 font-bold text-xs text-on-surface max-w-xs truncate">
                  <button onClick={() => handleOpenDetails(exam)} className="hover:text-primary transition-colors text-left">
                    {exam.name}
                  </button>
                </td>

                <td className="px-4 py-3 text-xs">
                  <Badge variant="info">{exam.category}</Badge>
                </td>

                <td className="px-4 py-3 text-xs text-on-surface-variant max-w-xs truncate font-medium">
                  {exam.subjects.join(', ')}
                </td>

                <td className="px-4 py-3 font-mono text-xs font-bold text-on-surface">
                  {exam.totalQuestions} Qs
                </td>

                <td className="px-4 py-3 font-mono text-xs font-bold text-emerald-600">
                  {exam.totalMarks} pts
                </td>

                <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">
                  {exam.durationMinutes} mins
                </td>

                <td className="px-4 py-3 text-xs">
                  <Badge variant={exam.status === 'Published' ? 'success' : 'warning'}>
                    {exam.status}
                  </Badge>
                </td>

                <td className="px-4 py-3 text-xs text-on-surface-variant">
                  {exam.createdBy}
                </td>

                <td className="px-4 py-3 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenDetails(exam)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                      title="Inspect Blueprint Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(exam)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                      title="Edit Exam Blueprint"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDuplicateExam(exam)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                      title="Duplicate Exam"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteExam(exam.code)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-red-600 transition-colors"
                      title="Delete Exam"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={11} className="px-4 py-8 text-center text-xs text-on-surface-variant">
              No exams match your search or filter parameters.
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

      {/* Exam Details Drawer */}
      <ExamDetailsDrawer
        exam={selectedExamForDrawer}
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        onEdit={handleOpenEdit}
        onDuplicate={handleDuplicateExam}
        onDelete={handleDeleteExam}
      />

      {/* 6-Step Multi-Stage Exam Creation Wizard */}
      <ExamWizardModal
        isOpen={isWizardModalOpen}
        onClose={() => setIsWizardModalOpen(false)}
        examToEdit={examToEdit}
        onSaveExam={handleSaveExam}
      />
    </div>
  );
}
