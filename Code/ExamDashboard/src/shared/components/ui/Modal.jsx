import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  icon: Icon,
  iconBg = "bg-red-100 text-red-600",
  maxWidth = "max-w-md"
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`bg-surface-container-lowest w-full ${maxWidth} rounded-xl shadow-2xl p-6 border border-outline-variant transform transition-all duration-200 scale-100 relative`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-surface-variant transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          {title && <h3 className="text-xl font-bold text-on-surface">{title}</h3>}
        </div>

        <div className="text-on-surface-variant text-sm mb-6">{children}</div>

        {footer && <div className="flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
