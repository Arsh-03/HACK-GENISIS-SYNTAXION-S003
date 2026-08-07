import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ExamBlueprintVisualizer } from './ExamBlueprintVisualizer';
import {
  X,
  FileText,
  Clock,
  Award,
  Layers,
  ShieldCheck,
  Calculator,
  Lock,
  Camera,
  Edit,
  Copy,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export function ExamDetailsDrawer({
  exam,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onDelete
}) {
  if (!isOpen || !exam) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-surface-bright border-b border-outline-variant flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {exam.code}
                  </span>
                  <Badge variant={exam.status === 'Published' ? 'success' : 'warning'}>
                    {exam.status}
                  </Badge>
                  <Badge variant="info">{exam.category}</Badge>
                </div>
                <h2 className="text-lg font-bold text-on-surface mt-1">{exam.name}</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Overview specs */}
            <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Exam Overview & Scope
              </h3>
              <p className="text-xs text-on-surface leading-relaxed">{exam.description}</p>
              
              <div className="grid grid-cols-3 gap-3 text-xs pt-2 border-t border-outline-variant/60">
                <div>
                  <span className="text-on-surface-variant block font-medium">Duration</span>
                  <span className="font-bold text-on-surface font-mono">{exam.durationMinutes} mins</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block font-medium">Total Questions</span>
                  <span className="font-bold text-primary font-mono">{exam.totalQuestions} Qs</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block font-medium">Max Score</span>
                  <span className="font-bold text-emerald-600 font-mono">{exam.totalMarks} Pts</span>
                </div>
              </div>
            </div>

            {/* Blueprint Visualization */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Blueprint & Weightage Distribution
              </h3>
              <ExamBlueprintVisualizer
                blueprint={exam.blueprint}
                totalQuestions={exam.totalQuestions}
                totalMarks={exam.totalMarks}
              />
            </div>

            {/* Security Rules & Settings */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Proctoring & Security Rules
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs p-4 rounded-xl bg-surface-bright border border-outline-variant">
                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                  <span className="text-on-surface-variant">Calculator</span>
                  <span className="font-bold text-on-surface">
                    {exam.rules?.calculatorAllowed ? 'Allowed' : 'Prohibited'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                  <span className="text-on-surface-variant">Negative Marking</span>
                  <span className="font-bold text-on-surface">
                    {exam.rules?.negativeMarking ? exam.rules.negativeMarkPenalty : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                  <span className="text-on-surface-variant">Question Shuffle</span>
                  <span className="font-bold text-on-surface">
                    {exam.rules?.randomizeQuestions ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                  <span className="text-on-surface-variant">Camera Proctoring</span>
                  <span className="font-bold text-emerald-600">
                    {exam.rules?.cameraRequired ? 'Active AI Tracking' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="p-4 bg-surface-bright border-t border-outline-variant flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={Edit}
                onClick={() => onEdit(exam)}
              >
                Edit Blueprint
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Copy}
                onClick={() => onDuplicate(exam)}
              >
                Duplicate Exam
              </Button>
            </div>

            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => onDelete(exam.code)}
            >
              Delete Exam
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
