import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { MOCK_CATEGORIES, MOCK_AVAILABLE_SUBJECTS } from '../../../services/mockExams';
import { ExamBlueprintVisualizer } from './ExamBlueprintVisualizer';
import {
  FileText,
  Plus,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  BarChart3,
  ShieldCheck,
  Calculator,
  Lock,
  Camera,
  RotateCcw,
  Check
} from 'lucide-react';

export function ExamWizardModal({
  isOpen,
  onClose,
  examToEdit,
  onSaveExam
}) {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    code: 'EXM-2026-CS101',
    name: 'Computer Science Comprehensive Midterm',
    category: MOCK_CATEGORIES[0],
    description: 'Comprehensive assessment paper for mid-semester evaluation.',
    durationMinutes: 180,
    totalMarks: 100,
    totalQuestions: 50,
    selectedSubjects: ['Computer Science', 'Artificial Intelligence'],
    subjectWeightages: [
      { subject: 'Computer Science', weightage: 60, questions: 30 },
      { subject: 'Artificial Intelligence', weightage: 40, questions: 20 }
    ],
    difficultyRatio: { easy: 40, medium: 40, hard: 20 },
    rules: {
      calculatorAllowed: false,
      negativeMarking: true,
      negativeMarkPenalty: '0.25 pts',
      randomizeQuestions: true,
      shuffleOptions: true,
      tabSwitchingLimit: 2,
      cameraRequired: true,
      fullscreenRequired: true
    }
  });

  useEffect(() => {
    if (examToEdit) {
      setFormData({
        code: examToEdit.code || '',
        name: examToEdit.name || '',
        category: examToEdit.category || MOCK_CATEGORIES[0],
        description: examToEdit.description || '',
        durationMinutes: examToEdit.durationMinutes || 180,
        totalMarks: examToEdit.totalMarks || 100,
        totalQuestions: examToEdit.totalQuestions || 50,
        selectedSubjects: examToEdit.subjects || ['Computer Science'],
        subjectWeightages: examToEdit.blueprint?.subjectWeightage || [
          { subject: 'Computer Science', weightage: 100, questions: 50 }
        ],
        difficultyRatio: examToEdit.blueprint?.difficultyRatio || { easy: 40, medium: 40, hard: 20 },
        rules: examToEdit.rules || {
          calculatorAllowed: false,
          negativeMarking: true,
          negativeMarkPenalty: '0.25 pts',
          randomizeQuestions: true,
          shuffleOptions: true,
          tabSwitchingLimit: 2,
          cameraRequired: true,
          fullscreenRequired: true
        }
      });
    } else {
      setFormData({
        code: `EXM-2026-0${Math.floor(10 + Math.random() * 90)}`,
        name: '',
        category: MOCK_CATEGORIES[0],
        description: '',
        durationMinutes: 180,
        totalMarks: 100,
        totalQuestions: 50,
        selectedSubjects: ['Computer Science', 'Artificial Intelligence'],
        subjectWeightages: [
          { subject: 'Computer Science', weightage: 60, questions: 30 },
          { subject: 'Artificial Intelligence', weightage: 40, questions: 20 }
        ],
        difficultyRatio: { easy: 40, medium: 40, hard: 20 },
        rules: {
          calculatorAllowed: false,
          negativeMarking: true,
          negativeMarkPenalty: '0.25 pts',
          randomizeQuestions: true,
          shuffleOptions: true,
          tabSwitchingLimit: 2,
          cameraRequired: true,
          fullscreenRequired: true
        }
      });
    }
    setCurrentStep(1);
  }, [examToEdit, isOpen]);

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Exam Info' },
    { number: 2, title: 'Subjects' },
    { number: 3, title: 'Blueprint' },
    { number: 4, title: 'Difficulty' },
    { number: 5, title: 'Security Rules' },
    { number: 6, title: 'Preview' }
  ];

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleToggleSubject = (subj) => {
    const exists = formData.selectedSubjects.includes(subj);
    let updated;
    if (exists) {
      if (formData.selectedSubjects.length <= 1) return; // Must have at least 1
      updated = formData.selectedSubjects.filter(s => s !== subj);
    } else {
      updated = [...formData.selectedSubjects, subj];
    }
    
    // Recalculate weightages
    const equalWeight = Math.floor(100 / updated.length);
    const newWeightages = updated.map((s, idx) => ({
      subject: s,
      weightage: idx === 0 ? 100 - equalWeight * (updated.length - 1) : equalWeight,
      questions: Math.round((equalWeight / 100) * formData.totalQuestions)
    }));

    setFormData({
      ...formData,
      selectedSubjects: updated,
      subjectWeightages: newWeightages
    });
  };

  const handleWeightageChange = (idx, weight) => {
    const val = parseInt(weight, 10) || 0;
    const updated = [...formData.subjectWeightages];
    updated[idx].weightage = val;
    updated[idx].questions = Math.round((val / 100) * formData.totalQuestions);
    setFormData({ ...formData, subjectWeightages: updated });
  };

  const handleDifficultyChange = (field, val) => {
    const num = parseInt(val, 10) || 0;
    setFormData({
      ...formData,
      difficultyRatio: { ...formData.difficultyRatio, [field]: num }
    });
  };

  const totalWeightage = formData.subjectWeightages.reduce((acc, curr) => acc + curr.weightage, 0);

  const handleFinish = (status = 'Published') => {
    onSaveExam({
      ...formData,
      subjects: formData.selectedSubjects,
      status: status,
      createdBy: 'Dr. Sarah Jenkins',
      lastUpdated: new Date().toISOString().split('T')[0],
      blueprint: {
        subjectWeightage: formData.subjectWeightages,
        difficultyRatio: formData.difficultyRatio,
        topicDistribution: ['Core Theory', 'Problem Solving', 'Applied Scenarios']
      }
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={examToEdit ? `Edit Exam Blueprint: ${examToEdit.code}` : 'Multi-Step Exam Creation Wizard'}
      icon={Sparkles}
      iconBg="bg-primary/10 text-primary"
      maxWidth="max-w-3xl"
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrev} icon={ChevronLeft}>
                Back Step
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 6 ? (
              <Button variant="primary" onClick={handleNext}>
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => handleFinish('Draft')}>
                  Save Draft
                </Button>
                <Button variant="primary" onClick={() => handleFinish('Published')}>
                  Publish Examination
                </Button>
              </>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stepper Header */}
        <div className="flex items-center justify-between border-b border-outline-variant pb-4">
          {steps.map(step => (
            <div
              key={step.number}
              onClick={() => setCurrentStep(step.number)}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                currentStep === step.number
                  ? 'text-primary font-bold'
                  : currentStep > step.number
                  ? 'text-emerald-600 font-semibold'
                  : 'text-on-surface-variant'
              }`}
            >
              <div className={`w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center ${
                currentStep === step.number
                  ? 'bg-primary text-on-primary'
                  : currentStep > step.number
                  ? 'bg-emerald-500 text-white'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                {currentStep > step.number ? <Check className="w-3.5 h-3.5" /> : step.number}
              </div>
              <span className="hidden md:inline text-xs">{step.title}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: EXAM INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Exam Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
              <Select
                label="Category"
                options={MOCK_CATEGORIES}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <Input
              label="Exam Title"
              placeholder="e.g. Computer Science Comprehensive Midterm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="w-full flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Exam Overview Description
              </label>
              <textarea
                rows={2}
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-xs text-on-surface focus:ring-2 focus:ring-primary"
                placeholder="Describe assessment scope, target candidate batches..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Duration (Minutes)"
                type="number"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value, 10) || 180 })}
                required
              />
              <Input
                label="Total Marks (Pts)"
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value, 10) || 100 })}
                required
              />
              <Input
                label="Total Questions"
                type="number"
                value={formData.totalQuestions}
                onChange={(e) => setFormData({ ...formData, totalQuestions: parseInt(e.target.value, 10) || 50 })}
                required
              />
            </div>
          </div>
        )}

        {/* STEP 2: SUBJECT SELECTION */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Select Included Subjects for Paper Synthesis
            </div>

            <div className="grid grid-cols-2 gap-3">
              {MOCK_AVAILABLE_SUBJECTS.map(subj => {
                const selected = formData.selectedSubjects.includes(subj);
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => handleToggleSubject(subj)}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selected
                        ? 'border-primary bg-primary/10 font-bold text-primary shadow-xs'
                        : 'border-outline-variant bg-surface-bright hover:border-primary/50 text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <Layers className="w-4 h-4 text-primary" />
                      <span>{subj}</span>
                    </div>
                    {selected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-lg bg-surface-bright border border-outline-variant text-xs text-on-surface-variant">
              Selected <strong>{formData.selectedSubjects.length} subject(s)</strong>. Weightages will be configured in Step 3.
            </div>
          </div>
        )}

        {/* STEP 3: BLUEPRINT BUILDER */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Configure Subject Weightage Percentages
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                totalWeightage === 100 ? 'bg-emerald-500/10 text-emerald-700' : 'bg-red-500/10 text-red-700'
              }`}>
                Total: {totalWeightage}% {totalWeightage !== 100 && '(Must equal 100%)'}
              </span>
            </div>

            <div className="space-y-3">
              {formData.subjectWeightages.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface-bright border border-outline-variant space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-on-surface">{item.subject}</span>
                    <span className="text-primary font-mono">{item.weightage}% ({item.questions} Qs)</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={item.weightage}
                      onChange={(e) => handleWeightageChange(idx, e.target.value)}
                      className="flex-1 accent-primary cursor-pointer"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.weightage}
                      onChange={(e) => handleWeightageChange(idx, e.target.value)}
                      className="w-16 px-2 py-1 bg-surface-container-lowest border border-outline-variant rounded font-mono text-xs font-bold text-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: QUESTION DISTRIBUTION */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Difficulty Calibration Ratio (%)
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="text-xs font-bold text-emerald-900">Easy Questions</div>
                <Input
                  type="number"
                  value={formData.difficultyRatio.easy}
                  onChange={(e) => handleDifficultyChange('easy', e.target.value)}
                />
                <div className="text-[10px] font-mono text-emerald-800">
                  ~{Math.round((formData.difficultyRatio.easy / 100) * formData.totalQuestions)} Questions
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="text-xs font-bold text-amber-900">Medium Questions</div>
                <Input
                  type="number"
                  value={formData.difficultyRatio.medium}
                  onChange={(e) => handleDifficultyChange('medium', e.target.value)}
                />
                <div className="text-[10px] font-mono text-amber-800">
                  ~{Math.round((formData.difficultyRatio.medium / 100) * formData.totalQuestions)} Questions
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
                <div className="text-xs font-bold text-red-900">Hard Questions</div>
                <Input
                  type="number"
                  value={formData.difficultyRatio.hard}
                  onChange={(e) => handleDifficultyChange('hard', e.target.value)}
                />
                <div className="text-[10px] font-mono text-red-800">
                  ~{Math.round((formData.difficultyRatio.hard / 100) * formData.totalQuestions)} Questions
                </div>
              </div>
            </div>

            <ExamBlueprintVisualizer
              blueprint={{
                subjectWeightage: formData.subjectWeightages,
                difficultyRatio: formData.difficultyRatio
              }}
              totalQuestions={formData.totalQuestions}
              totalMarks={formData.totalMarks}
            />
          </div>
        )}

        {/* STEP 5: EXAM RULES */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Security Policy & Assessment Rules Configuration
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="p-3.5 rounded-xl bg-surface-bright border border-outline-variant flex items-center justify-between cursor-pointer">
                <div className="space-y-0.5">
                  <div className="font-bold text-on-surface flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-primary" /> On-Screen Calculator
                  </div>
                  <div className="text-[10px] text-on-surface-variant">Allow scientific digital calculator</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.rules.calculatorAllowed}
                  onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, calculatorAllowed: e.target.checked } })}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
              </label>

              <label className="p-3.5 rounded-xl bg-surface-bright border border-outline-variant flex items-center justify-between cursor-pointer">
                <div className="space-y-0.5">
                  <div className="font-bold text-on-surface flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Negative Marking
                  </div>
                  <div className="text-[10px] text-on-surface-variant">Deduct score for incorrect answers</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.rules.negativeMarking}
                  onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, negativeMarking: e.target.checked } })}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
              </label>

              <label className="p-3.5 rounded-xl bg-surface-bright border border-outline-variant flex items-center justify-between cursor-pointer">
                <div className="space-y-0.5">
                  <div className="font-bold text-on-surface flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-indigo-600" /> Randomize Question Order
                  </div>
                  <div className="text-[10px] text-on-surface-variant">Shuffle items per candidate</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.rules.randomizeQuestions}
                  onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, randomizeQuestions: e.target.checked } })}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
              </label>

              <label className="p-3.5 rounded-xl bg-surface-bright border border-outline-variant flex items-center justify-between cursor-pointer">
                <div className="space-y-0.5">
                  <div className="font-bold text-on-surface flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-600" /> AI Camera Proctoring
                  </div>
                  <div className="text-[10px] text-on-surface-variant">Webcam facial tracking active</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.rules.cameraRequired}
                  onChange={(e) => setFormData({ ...formData, rules: { ...formData.rules, cameraRequired: e.target.checked } })}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
              </label>
            </div>
          </div>
        )}

        {/* STEP 6: PREVIEW */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-emerald-900">Exam Blueprint Ready</div>
                <div className="text-xs text-emerald-800">Review final paper specification before publishing.</div>
              </div>
              <Badge variant="success">Validated 100%</Badge>
            </div>

            <ExamBlueprintVisualizer
              blueprint={{
                subjectWeightage: formData.subjectWeightages,
                difficultyRatio: formData.difficultyRatio
              }}
              totalQuestions={formData.totalQuestions}
              totalMarks={formData.totalMarks}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
