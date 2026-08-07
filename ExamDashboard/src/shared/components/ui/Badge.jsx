import React from 'react';

export function Badge({
  children,
  variant = 'default', // 'default', 'success', 'warning', 'danger', 'info', 'mono'
  size = 'md',
  className = ''
}) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-indigo-50 text-indigo-700 border-indigo-200",
    mono: "bg-slate-900 text-slate-200 border-slate-700 font-mono"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1 text-sm"
  };

  return (
    <span className={`inline-flex items-center font-bold tracking-wider uppercase rounded border ${variants[variant] || variants.default} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
