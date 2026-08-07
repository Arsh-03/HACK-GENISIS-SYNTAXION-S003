import React from 'react';

export function Input({
  label,
  error,
  helperText,
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
      <input
        className={`w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {helperText && !error && <span className="text-xs text-on-surface-variant">{helperText}</span>}
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  );
}
