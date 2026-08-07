import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Tag,
  Sparkles,
  Edit,
  Copy,
  Trash2,
  BookOpen,
  Award,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export function QuestionPreviewDrawer({
  question,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onDelete
}) {
  if (!isOpen || !question) return null;

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
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
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
                    {question.id}
                  </span>
                  {getDifficultyBadge(question.difficulty)}
                  <Badge variant="info">{question.type}</Badge>
                </div>
                <h2 className="text-lg font-bold text-on-surface mt-1">{question.title}</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Specifications Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-4 rounded-xl bg-surface-bright border border-outline-variant">
              <div>
                <span className="text-on-surface-variant block font-medium">Subject</span>
                <span className="font-bold text-on-surface">{question.subject}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block font-medium">Topic / Chapter</span>
                <span className="font-bold text-on-surface">{question.topic}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block font-medium">Marks Weight</span>
                <span className="font-bold text-primary font-mono">{question.marks} Points</span>
              </div>
              <div>
                <span className="text-on-surface-variant block font-medium">Bloom's Taxonomy</span>
                <span className="font-bold text-indigo-600">{question.bloomsTaxonomy}</span>
              </div>
            </div>

            {/* Question Prompt */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Full Question Prompt
              </h3>
              <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant text-sm font-medium text-on-surface leading-relaxed whitespace-pre-wrap">
                {question.prompt}
              </div>
            </div>

            {/* Attached Diagram / Image if available */}
            {question.imageUrl && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Attached Diagram
                </h3>
                <div className="p-2 rounded-xl bg-surface-bright border border-outline-variant overflow-hidden max-w-md">
                  <img
                    src={question.imageUrl}
                    alt="Question Diagram"
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              </div>
            )}

            {/* Options List for Multiple Choice / Multiple Correct */}
            {question.options && question.options.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Options & Answer Key
                </h3>
                <div className="space-y-2">
                  {question.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
                        opt.isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-900 font-bold'
                          : 'bg-surface-bright border-outline-variant text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                          opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {opt.id.split('-')[1]?.toUpperCase()}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {opt.isCorrect && (
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Correct Answer Key (Numerical / Descriptive) */}
            {(!question.options || question.options.length === 0) && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Correct Answer Key / Rubric
                </h3>
                <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-xs text-emerald-900 font-mono font-bold">
                  {question.correctAnswerText}
                </div>
              </div>
            )}

            {/* Explanation & Rationale */}
            {question.explanation && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Solution Rationale & Explanation
                </h3>
                <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant text-xs text-on-surface leading-relaxed">
                  {question.explanation}
                </div>
              </div>
            )}

            {/* Tags & Metadata */}
            {question.tags && question.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Taxonomy Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {question.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[11px] font-semibold border border-outline-variant">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Version History Audit Log */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Version History Audit
              </h3>
              <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant space-y-3 text-xs">
                {question.versionHistory?.map((ver, idx) => (
                  <div key={idx} className="flex items-start justify-between border-b border-outline-variant/50 pb-2 last:border-0 last:pb-0">
                    <div>
                      <div className="font-bold text-on-surface flex items-center gap-2">
                        <span className="font-mono text-primary">{ver.version}</span>
                        <span>- {ver.comment}</span>
                      </div>
                      <div className="text-[10px] text-on-surface-variant">Author: {ver.author}</div>
                    </div>
                    <span className="font-mono text-[10px] text-on-surface-variant">{ver.date}</span>
                  </div>
                ))}
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
                onClick={() => onEdit(question)}
              >
                Edit Item
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Copy}
                onClick={() => onDuplicate(question)}
              >
                Duplicate
              </Button>
            </div>

            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => onDelete(question.id)}
            >
              Delete Item
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
