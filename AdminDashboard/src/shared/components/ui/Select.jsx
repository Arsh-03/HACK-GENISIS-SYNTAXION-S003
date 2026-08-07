import React from 'react';

export function Select({
  label,
  options = [],
  className = '',
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${className}`}
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
    </div>
  );
}
