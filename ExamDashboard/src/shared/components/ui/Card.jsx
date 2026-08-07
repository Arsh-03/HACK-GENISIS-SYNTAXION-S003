import React from 'react';

export function Card({
  children,
  className = '',
  accentLeft = false,
  accentColor = 'bg-primary',
  title,
  subtitle,
  headerAction,
  footer,
  ...props
}) {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm relative overflow-hidden ${className}`}
      {...props}
    >
      {accentLeft && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor}`} />
      )}
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
          <div>
            {title && <h3 className="font-semibold text-on-surface text-base">{title}</h3>}
            {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-3 border-t border-outline-variant bg-surface-bright flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}
