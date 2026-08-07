import React from 'react';

export function StatCard({
  title,
  value,
  change,
  changeType = 'increase', // 'increase', 'decrease', 'neutral'
  icon: Icon,
  iconBg = 'bg-indigo-50 text-indigo-600',
  description
}) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-start justify-between">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          {title}
        </span>
        <div className="text-2xl font-bold text-on-surface mt-1">{value}</div>
        {(change || description) && (
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            {change && (
              <span className={`font-semibold ${changeType === 'increase' ? 'text-emerald-600' : changeType === 'decrease' ? 'text-red-600' : 'text-slate-500'}`}>
                {change}
              </span>
            )}
            {description && <span className="text-on-surface-variant">{description}</span>}
          </div>
        )}
      </div>
      {Icon && (
        <div className={`p-3 rounded-lg ${iconBg} shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
