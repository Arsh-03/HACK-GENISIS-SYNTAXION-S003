import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

export function SessionCalendarView({ sessions = [], onSelectSession }) {
  const [currentMonth, setCurrentMonth] = useState('August 2026');

  // Days of August 2026 mock grid (31 days)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Group sessions by day of month (e.g. '2026-08-15' -> 15)
  const sessionsByDay = {};
  sessions.forEach(sec => {
    const day = parseInt(sec.date.split('-')[2], 10);
    if (!sessionsByDay[day]) {
      sessionsByDay[day] = [];
    }
    sessionsByDay[day].push(sec);
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Scheduled':
        return 'info';
      case 'Completed':
        return 'mono';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Month Navigation Header */}
      <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-on-surface">{currentMonth} Scheduling Matrix</h2>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-bright text-on-surface-variant">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold font-mono px-3 py-1 bg-surface-bright rounded border border-outline-variant">
            {currentMonth}
          </span>
          <button className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-bright text-on-surface-variant">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-on-surface-variant py-1">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map(day => {
          const daySessions = sessionsByDay[day] || [];
          return (
            <div
              key={day}
              className={`min-h-[110px] p-2 rounded-xl border bg-surface-container-lowest flex flex-col justify-between transition-colors ${
                daySessions.length > 0 ? 'border-primary/40' : 'border-outline-variant'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className={`font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                  day === 15 ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
                }`}>
                  {day}
                </span>
                {daySessions.length > 0 && (
                  <span className="text-[10px] font-bold text-primary font-mono">
                    {daySessions.length} session(s)
                  </span>
                )}
              </div>

              {/* Session Pills inside day cell */}
              <div className="space-y-1 mt-1 flex-1 overflow-y-auto">
                {daySessions.map(sec => (
                  <button
                    key={sec.code}
                    onClick={() => onSelectSession(sec)}
                    className="w-full text-left p-1.5 rounded bg-surface-bright border border-outline-variant hover:border-primary transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary font-mono truncate group-hover:underline">
                        {sec.code}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${
                        sec.status === 'Active' ? 'bg-emerald-500' : sec.status === 'Scheduled' ? 'bg-blue-500' : 'bg-slate-400'
                      }`} />
                    </div>
                    <div className="text-[10px] font-semibold text-on-surface truncate">
                      {sec.examName}
                    </div>
                    <div className="text-[9px] text-on-surface-variant font-mono truncate flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{sec.startTime}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
