import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { BarChart3, PieChart, Layers, Sparkles, ShieldCheck } from 'lucide-react';

export function QuestionBankAnalytics({ questions = [] }) {
  // Compute analytics from questions dataset
  const total = questions.length || 1;

  const subjectCounts = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0, Expert: 0 };
  const typeCounts = { 'Multiple Choice': 0, 'Multiple Correct': 0, 'Numerical': 0, 'Descriptive': 0 };

  questions.forEach(q => {
    subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
    if (difficultyCounts[q.difficulty] !== undefined) {
      difficultyCounts[q.difficulty]++;
    }
    if (typeCounts[q.type] !== undefined) {
      typeCounts[q.type]++;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Questions per Subject */}
      <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>Questions per Subject</span>
          </div>
          <span className="text-xs font-bold font-mono text-primary">{total} Total</span>
        </div>

        <div className="space-y-2.5 pt-1">
          {Object.entries(subjectCounts).map(([subject, count]) => {
            const percent = Math.round((count / total) * 100);
            return (
              <div key={subject} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-on-surface truncate">{subject}</span>
                  <span className="font-mono text-on-surface-variant font-bold">{count} ({percent}%)</span>
                </div>
                <ProgressBar progress={percent} color="bg-primary" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Difficulty Distribution */}
      <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <PieChart className="w-4 h-4 text-amber-500" />
            <span>Difficulty Matrix</span>
          </div>
          <span className="text-xs font-bold font-mono text-amber-600">Calibrated</span>
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-emerald-700">Easy</span>
              <span className="font-mono text-on-surface-variant font-bold">{difficultyCounts.Easy}</span>
            </div>
            <ProgressBar progress={Math.round((difficultyCounts.Easy / total) * 100)} color="bg-emerald-600" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-amber-700">Medium</span>
              <span className="font-mono text-on-surface-variant font-bold">{difficultyCounts.Medium}</span>
            </div>
            <ProgressBar progress={Math.round((difficultyCounts.Medium / total) * 100)} color="bg-amber-500" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-orange-700">Hard</span>
              <span className="font-mono text-on-surface-variant font-bold">{difficultyCounts.Hard}</span>
            </div>
            <ProgressBar progress={Math.round((difficultyCounts.Hard / total) * 100)} color="bg-orange-500" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-red-700">Expert</span>
              <span className="font-mono text-on-surface-variant font-bold">{difficultyCounts.Expert}</span>
            </div>
            <ProgressBar progress={Math.round((difficultyCounts.Expert / total) * 100)} color="bg-red-600" />
          </div>
        </div>
      </div>

      {/* 3. Question Types */}
      <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Question Types</span>
          </div>
          <span className="text-xs font-bold font-mono text-indigo-600">4 Formats</span>
        </div>

        <div className="space-y-2.5 pt-1">
          {Object.entries(typeCounts).map(([type, count]) => {
            const percent = Math.round((count / total) * 100);
            return (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-on-surface">{type}</span>
                  <span className="font-mono text-on-surface-variant font-bold">{count}</span>
                </div>
                <ProgressBar progress={percent} color="bg-indigo-600" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
