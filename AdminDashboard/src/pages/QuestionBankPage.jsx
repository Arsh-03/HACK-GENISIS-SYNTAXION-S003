import React, { useState, useMemo } from 'react';
import { Card } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import { Badge } from '../shared/components/ui/Badge';
import { Table } from '../shared/components/ui/Table';

import {
  INITIAL_QUESTIONS,
  MOCK_SUBJECTS,
  MOCK_DIFFICULTIES,
  MOCK_QUESTION_TYPES,
  MOCK_SOURCES
} from '../services/mockQuestionBank';

import { QuestionBankAnalytics } from '../shared/components/questions/QuestionBankAnalytics';
import { QuestionPreviewDrawer } from '../shared/components/questions/QuestionPreviewDrawer';
import { QuestionFormModal } from '../shared/components/questions/QuestionFormModal';
import { QuestionImportWizardModal } from '../shared/components/questions/QuestionImportWizardModal';

import {
  Layers,
  Sparkles,
  Plus,
  FileSpreadsheet,
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
  FileCode,
  BookOpen,
  Filter
} from 'lucide-react';

export function QuestionBankPage() {
  // Main Data State
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Selection
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Drawer & Modals State
  const [selectedQuestionForDrawer, setSelectedQuestionForDrawer] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [isImportWizardOpen, setIsImportWizardOpen] = useState(false);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch =
        q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.prompt.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubject = subjectFilter === 'All' || q.subject === subjectFilter;
      const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
      const matchesType = typeFilter === 'All' || q.type === typeFilter;
      const matchesSource = sourceFilter === 'All' || q.source === sourceFilter;
      const matchesStatus = statusFilter === 'All' || q.status === statusFilter;

      return matchesSearch && matchesSubject && matchesDifficulty && matchesType && matchesSource && matchesStatus;
    });
  }, [questions, searchTerm, subjectFilter, difficultyFilter, typeFilter, sourceFilter, statusFilter]);

  // Paginated Questions
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(start, start + itemsPerPage);
  }, [filteredQuestions, currentPage]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage) || 1;

  // Checkbox Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedQuestionIds(paginatedQuestions.map(q => q.id));
    } else {
      setSelectedQuestionIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedQuestionIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Handlers
  const handleOpenPreview = (question) => {
    setSelectedQuestionForDrawer(question);
    setIsPreviewOpen(true);
  };

  const handleOpenEdit = (question) => {
    setQuestionToEdit(question);
    setIsFormModalOpen(true);
  };

  const handleOpenAdd = () => {
    setQuestionToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleDuplicateQuestion = (question) => {
    const duplicated = {
      ...question,
      id: `Q-2026-0${Math.floor(200 + Math.random() * 800)}`,
      title: `${question.title} (Copy)`,
      version: 'v1.0',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setQuestions(prev => [duplicated, ...prev]);
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm(`Are you sure you want to delete question item ${id}?`)) {
      setQuestions(prev => prev.filter(q => q.id !== id));
      if (selectedQuestionForDrawer && selectedQuestionForDrawer.id === id) {
        setIsPreviewOpen(false);
      }
    }
  };

  const handleSaveQuestion = (savedData) => {
    if (questionToEdit) {
      setQuestions(prev => prev.map(q => (q.id === savedData.id ? { ...q, ...savedData } : q)));
    } else {
      setQuestions(prev => [
        {
          ...savedData,
          lastUpdated: new Date().toISOString().split('T')[0],
          versionHistory: [{ version: 'v1.0', date: new Date().toISOString().split('T')[0], author: 'Admin Proctor', comment: 'Item created' }]
        },
        ...prev
      ]);
    }
  };

  const handleBulkImportSuccess = (newItems) => {
    setQuestions(prev => [...newItems, ...prev]);
  };

  const handleExport = (format) => {
    alert(`Exporting Question Bank (${filteredQuestions.length} items) in ${format.toUpperCase()} format.`);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSubjectFilter('All');
    setDifficultyFilter('All');
    setTypeFilter('All');
    setSourceFilter('All');
    setStatusFilter('All');
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return <Badge variant="success">Easy</Badge>;
      case 'Medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'Hard':
        return <Badge variant="danger">Hard</Badge>;
      case 'Expert':
        return <Badge variant="mono">Expert</Badge>;
      default:
        return <Badge variant="default">{diff}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-on-surface">Question Bank Repository</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Item bank taxonomy, multi-format question editor, Bloom’s level mapping, and bulk import/export.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Button
            variant="outline"
            size="sm"
            icon={FileSpreadsheet}
            onClick={() => setIsImportWizardOpen(true)}
          >
            Import Wizard
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenAdd}
          >
            Add Question
          </Button>
        </div>
      </div>

      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Total Questions
          </div>
          <div className="text-2xl font-black text-on-surface font-mono">2,450</div>
          <div className="text-[10px] text-on-surface-variant">Across 5 subjects</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Active Verified
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">1,980</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Ready for exam assembly</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Draft Items
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">270</div>
          <div className="text-[10px] text-on-surface-variant">Pending faculty review</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
            Recently Imported
          </div>
          <div className="text-2xl font-black text-primary font-mono">120</div>
          <div className="text-[10px] text-on-surface-variant">Last 7 days</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            AI Generated
          </div>
          <div className="text-2xl font-black text-indigo-600 font-mono">380</div>
          <div className="text-[10px] text-indigo-600 font-semibold">Gemini LLM authored</div>
        </div>
      </div>

      {/* Question Analytics Distribution Charts */}
      <QuestionBankAnalytics questions={questions} />

      {/* Search & Filter Toolbar */}
      <Card className="shadow-xs">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Search Question Bank"
                placeholder="ID, Title, Prompt keywords..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Select
              label="Subject"
              options={['All', ...MOCK_SUBJECTS]}
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            />

            <Select
              label="Difficulty"
              options={['All', ...MOCK_DIFFICULTIES]}
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            />

            <Select
              label="Question Type"
              options={['All', ...MOCK_QUESTION_TYPES]}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />

            <Select
              label="Author Source"
              options={['All', ...MOCK_SOURCES]}
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/60">
            <div className="text-on-surface-variant font-medium">
              Showing <strong className="text-on-surface">{filteredQuestions.length}</strong> matching item(s)
            </div>

            <div className="flex items-center gap-3">
              {(searchTerm || subjectFilter !== 'All' || difficultyFilter !== 'All' || typeFilter !== 'All' || sourceFilter !== 'All') && (
                <button
                  onClick={handleResetFilters}
                  className="text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}

              {/* Export Buttons */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-outline-variant">
                <button
                  onClick={() => handleExport('csv')}
                  className="px-2 py-1 bg-surface-bright border border-outline-variant rounded hover:border-primary font-mono text-[10px] font-bold text-on-surface-variant"
                >
                  CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="px-2 py-1 bg-surface-bright border border-outline-variant rounded hover:border-primary font-mono text-[10px] font-bold text-on-surface-variant"
                >
                  EXCEL
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="px-2 py-1 bg-surface-bright border border-outline-variant rounded hover:border-primary font-mono text-[10px] font-bold text-on-surface-variant"
                >
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Action Bar */}
      {selectedQuestionIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-primary text-on-primary shadow-md flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{selectedQuestionIds.length} question(s) selected</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => handleExport('csv')}
              className="bg-white text-slate-900 border-white hover:bg-slate-100"
            >
              Export Selected
            </Button>

            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => {
                if (window.confirm(`Delete ${selectedQuestionIds.length} selected questions?`)) {
                  setQuestions(prev => prev.filter(q => !selectedQuestionIds.includes(q.id)));
                  setSelectedQuestionIds([]);
                }
              }}
            >
              Delete Selected
            </Button>

            <button
              onClick={() => setSelectedQuestionIds([])}
              className="text-xs text-on-primary/80 hover:text-white font-medium underline pl-2"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Question Data Table */}
      <Table
        headers={[
          <input
            type="checkbox"
            checked={
              paginatedQuestions.length > 0 &&
              paginatedQuestions.every(q => selectedQuestionIds.includes(q.id))
            }
            onChange={handleSelectAll}
            className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
          />,
          'Question ID',
          'Title & Preview',
          'Subject',
          'Topic',
          'Difficulty',
          'Marks',
          'Type',
          'Source',
          'Status',
          'Version',
          'Actions'
        ]}
      >
        {paginatedQuestions.length > 0 ? (
          paginatedQuestions.map((q) => {
            const isSelected = selectedQuestionIds.includes(q.id);
            return (
              <tr key={q.id} className={`hover:bg-surface-bright/80 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectOne(q.id)}
                    className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                  />
                </td>

                <td className="px-4 py-3 font-mono text-xs font-bold text-primary">
                  <button onClick={() => handleOpenPreview(q)} className="hover:underline text-left">
                    {q.id}
                  </button>
                </td>

                <td className="px-4 py-3 text-xs max-w-xs">
                  <div
                    onClick={() => handleOpenPreview(q)}
                    className="font-bold text-on-surface truncate cursor-pointer hover:text-primary transition-colors"
                  >
                    {q.title}
                  </div>
                  <div className="text-[11px] text-on-surface-variant truncate opacity-80 mt-0.5">
                    {q.prompt}
                  </div>
                </td>

                <td className="px-4 py-3 text-xs font-semibold text-on-surface">
                  {q.subject}
                </td>

                <td className="px-4 py-3 text-xs text-on-surface-variant">
                  {q.topic}
                </td>

                <td className="px-4 py-3 text-xs">
                  {getDifficultyBadge(q.difficulty)}
                </td>

                <td className="px-4 py-3 font-mono text-xs font-bold text-primary">
                  {q.marks} pts
                </td>

                <td className="px-4 py-3 text-xs font-mono">
                  {q.type}
                </td>

                <td className="px-4 py-3 text-xs">
                  <Badge variant={q.source === 'AI Generator' ? 'warning' : 'info'}>
                    {q.source}
                  </Badge>
                </td>

                <td className="px-4 py-3 text-xs">
                  <Badge variant={q.status === 'Active' ? 'success' : 'mono'}>
                    {q.status}
                  </Badge>
                </td>

                <td className="px-4 py-3 font-mono text-xs text-on-surface-variant font-bold">
                  {q.version}
                </td>

                <td className="px-4 py-3 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenPreview(q)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                      title="Inspect Full Question"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(q)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                      title="Edit Question"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDuplicateQuestion(q)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                      title="Duplicate Question"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-red-600 transition-colors"
                      title="Delete Question"
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
            <td colSpan={12} className="px-4 py-8 text-center text-xs text-on-surface-variant">
              No questions match your search or filter parameters.
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

      {/* Question Preview Drawer */}
      <QuestionPreviewDrawer
        question={selectedQuestionForDrawer}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onEdit={handleOpenEdit}
        onDuplicate={handleDuplicateQuestion}
        onDelete={handleDeleteQuestion}
      />

      {/* Question Form Modal (Add / Edit) */}
      <QuestionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        questionToEdit={questionToEdit}
        onSave={handleSaveQuestion}
      />

      {/* Import Wizard Modal */}
      <QuestionImportWizardModal
        isOpen={isImportWizardOpen}
        onClose={() => setIsImportWizardOpen(false)}
        onImportSuccess={handleBulkImportSuccess}
      />
    </div>
  );
}
