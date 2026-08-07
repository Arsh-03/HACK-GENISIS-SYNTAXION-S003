import React from 'react';
import { Video, Mic } from 'lucide-react';

export function QuestionPalette({
  subject = "Physics",
  sectionTitle = "Section 1: Core Concepts",
  currentQuestionNumber = 16,
  onSelectQuestion,
  questionStates = {},
  totalQuestions = 50,
  answeredCount = 44,
  markedCount = 3,
  unansweredCount = 2,
  notVisitedCount = 1
}) {
  return (
    <aside className="w-72 bg-surface-container-lowest border-r border-outline-variant flex flex-col h-full shrink-0 shadow-sm z-10 hidden lg:flex select-none">
      {/* Header Info */}
      <div className="p-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{subject}</h2>
          <p className="text-sm font-medium text-on-surface mt-1">{sectionTitle}</p>
        </div>
        <div className="flex gap-2">
          <Video className="w-4 h-4 text-emerald-600 animate-pulse" title="Webcam Live Monitoring" />
          <Mic className="w-4 h-4 text-emerald-600" title="Audio Monitor Active" />
        </div>
      </div>

      {/* Legend Grid */}
      <div className="p-4 border-b border-outline-variant">
        <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-600"></div>
            <span className="text-on-surface-variant font-medium">Answered ({answeredCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-500"></div>
            <span className="text-on-surface-variant font-medium">Marked ({markedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-100 border border-red-500"></div>
            <span className="text-on-surface-variant font-medium">Unanswered ({unansweredCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-white border border-slate-300"></div>
            <span className="text-on-surface-variant font-medium">Not Visited ({notVisitedCount})</span>
          </div>
        </div>
      </div>

      {/* Question Number Palette Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-on-surface-variant mb-3 uppercase tracking-wider">
            Question Palette ({totalQuestions} Items)
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalQuestions }, (_, index) => {
              const num = index + 1;
              const isCurrent = num === currentQuestionNumber;
              const state = questionStates[num] || (
                num <= 40 ? 'answered' :
                num <= 43 ? 'marked' :
                num <= 48 ? 'unanswered' : 'not-visited'
              );

              let paletteClass = "palette-not-visited";
              if (state === 'answered') paletteClass = "palette-answered";
              else if (state === 'marked') paletteClass = "palette-marked";
              else if (state === 'unanswered') paletteClass = "palette-unanswered";

              if (isCurrent) {
                paletteClass += " palette-active";
              }

              return (
                <button
                  key={num}
                  onClick={() => onSelectQuestion && onSelectQuestion(num)}
                  className={`question-palette-btn ${paletteClass}`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

