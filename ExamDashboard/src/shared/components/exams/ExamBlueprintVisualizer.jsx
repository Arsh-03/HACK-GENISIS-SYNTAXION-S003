import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { PieChart, BarChart3, Layers, Sparkles, Award, FileText } from 'lucide-react';

export function ExamBlueprintVisualizer({ blueprint, totalQuestions = 50, totalMarks = 100 }) {
  if (!blueprint) return null;

  const subjectWeightages = blueprint.subjectWeightage || [
    { subject: 'Computer Science', weightage: 60, questions: 30 },
    { subject: 'Artificial Intelligence', weightage: 40, questions: 20 }
  ];

  const difficultyRatio = blueprint.difficultyRatio || { easy: 40, medium: 40, hard: 20 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Subject Weightage Distribution */}
      <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>Subject Weightage</span>
          </div>
          <span className="text-xs font-bold font-mono text-primary">100% Total</span>
        </div>

        <div className="space-y-3 pt-1">
          {subjectWeightages.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-on-surface truncate">{item.subject}</span>
                <span className="font-mono text-on-surface-variant font-bold">
                  {item.weightage}% ({item.questions || Math.round((item.weightage / 100) * totalQuestions)} Qs)
                </span>
              </div>
              <ProgressBar progress={item.weightage} color="bg-primary" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Difficulty Breakdown Ratio */}
      <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <PieChart className="w-4 h-4 text-amber-500" />
            <span>Difficulty Breakdown</span>
          </div>
          <span className="text-xs font-bold font-mono text-amber-600">Calibrated</span>
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-emerald-700">Easy</span>
              <span className="font-mono text-on-surface-variant font-bold">{difficultyRatio.easy}%</span>
            </div>
            <ProgressBar progress={difficultyRatio.easy} color="bg-emerald-600" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-amber-700">Medium</span>
              <span className="font-mono text-on-surface-variant font-bold">{difficultyRatio.medium}%</span>
            </div>
            <ProgressBar progress={difficultyRatio.medium} color="bg-amber-500" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-red-700">Hard</span>
              <span className="font-mono text-on-surface-variant font-bold">{difficultyRatio.hard}%</span>
            </div>
            <ProgressBar progress={difficultyRatio.hard} color="bg-red-600" />
          </div>
        </div>
      </div>

      {/* 3. Question & Marks Summary Metrics */}
      <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Paper Allocation Summary</span>
          </div>
          <span className="text-xs font-bold font-mono text-indigo-600">Verified</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1 text-center">
          <div className="p-3 rounded-lg bg-surface-bright border border-outline-variant space-y-1">
            <div className="text-[10px] font-bold text-on-surface-variant uppercase">Total Questions</div>
            <div className="text-xl font-black text-primary font-mono">{totalQuestions} Qs</div>
          </div>

          <div className="p-3 rounded-lg bg-surface-bright border border-outline-variant space-y-1">
            <div className="text-[10px] font-bold text-on-surface-variant uppercase">Total Score</div>
            <div className="text-xl font-black text-emerald-600 font-mono">{totalMarks} Pts</div>
          </div>
        </div>

        <div className="text-[11px] text-on-surface-variant font-medium text-center pt-1 border-t border-outline-variant/60">
          Average weight: <strong className="text-on-surface font-mono">{(totalMarks / totalQuestions).toFixed(1)} pts / item</strong>
        </div>
      </div>
    </div>
  );
}
