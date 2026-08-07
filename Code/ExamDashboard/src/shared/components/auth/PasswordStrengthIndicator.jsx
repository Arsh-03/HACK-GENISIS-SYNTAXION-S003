import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export function PasswordStrengthIndicator({ password = '' }) {
  const rules = [
    { label: 'At least 8 characters long', valid: password.length >= 8 },
    { label: 'Contains an uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'Contains a number (0-9)', valid: /[0-9]/.test(password) },
    { label: 'Contains a special character (!@#$%^&*)', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const passedCount = rules.filter(r => r.valid).length;

  let strengthLabel = 'Weak';
  let colorClass = 'bg-red-500';
  let percentage = 25;

  if (passedCount === 2) {
    strengthLabel = 'Fair';
    colorClass = 'bg-amber-500';
    percentage = 50;
  } else if (passedCount === 3) {
    strengthLabel = 'Good';
    colorClass = 'bg-blue-500';
    percentage = 75;
  } else if (passedCount === 4) {
    strengthLabel = 'Strong';
    colorClass = 'bg-emerald-600';
    percentage = 100;
  } else if (password.length === 0) {
    strengthLabel = '';
    percentage = 0;
  }

  return (
    <div className="space-y-3 mt-2">
      {password.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-on-surface-variant">Password Strength:</span>
            <span className={`font-bold ${
              passedCount <= 1 ? 'text-red-600' :
              passedCount === 2 ? 'text-amber-600' :
              passedCount === 3 ? 'text-blue-600' : 'text-emerald-600'
            }`}>
              {strengthLabel}
            </span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div
              className={`h-full ${colorClass} transition-all duration-300 rounded-full`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5 p-3 rounded-lg bg-surface-bright border border-outline-variant text-xs">
        <div className="font-bold text-on-surface-variant uppercase text-[10px] tracking-wider mb-1">
          Password Requirements
        </div>
        {rules.map((rule, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {rule.valid ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            )}
            <span className={rule.valid ? 'text-on-surface font-medium' : 'text-on-surface-variant'}>
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
