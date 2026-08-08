import React from 'react';
import { Video, Mic } from 'lucide-react';

export function QuestionPalette({
  subject = "Computer Science 101",
  sectionTitle = "Section 1: Core Concepts",
  currentQuestionNumber = 1,
  onSelectQuestion,
  questionStates = {},
  sections = [],
  activeSectionId = null,
  onSelectSection = null,
  totalQuestions = 0
}) {
  const answeredCount = Object.values(questionStates).filter(s => s === 'answered').length;
  const markedCount = Object.values(questionStates).filter(s => s === 'marked').length;
  const unansweredCount = Object.values(questionStates).filter(s => s === 'unanswered').length;
  const notVisitedCount = Math.max(0, totalQuestions - answeredCount - markedCount - unansweredCount);
  return (
    <aside className="w-80 bg-surface-container-lowest border-r border-outline-variant flex flex-col h-full shrink-0 shadow-sm z-10 hidden lg:flex select-none">
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
        {/* Sections Toggle */}
        {sections && sections.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-on-surface-variant mb-3 uppercase tracking-wider">
              Sections
            </h3>
            <div className="flex flex-col gap-2">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => onSelectSection && onSelectSection(sec.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-md text-left transition-colors ${
                    activeSectionId === sec.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-bright text-on-surface hover:bg-surface-container-high border border-outline-variant'
                  }`}
                >
                  {sec.shortName}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-xs font-semibold text-on-surface-variant mb-3 uppercase tracking-wider">
            Question Palette ({totalQuestions} Items)
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalQuestions }, (_, index) => {
              const num = index + 1;
              const isCurrent = num === currentQuestionNumber;
               const state = questionStates[num] || 'not-visited';

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

