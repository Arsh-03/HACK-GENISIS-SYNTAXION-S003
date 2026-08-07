import React from 'react';

export function ProgressBar({
  progress = 0, // 0 to 100
  height = 'h-1.5',
  color = 'bg-primary',
  trackColor = 'bg-slate-200',
  className = ''
}) {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${trackColor} ${height} rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${color} transition-all duration-300 ease-out rounded-full`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
