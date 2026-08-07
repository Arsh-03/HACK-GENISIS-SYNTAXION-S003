import React from 'react';

export function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md";

  const variants = {
    primary: "bg-primary text-on-primary hover:bg-opacity-90 active:bg-primary-hover shadow-sm",
    secondary: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
    outline: "border border-outline-variant text-on-surface bg-surface hover:bg-surface-variant",
    danger: "bg-error text-on-error hover:bg-red-700 shadow-sm",
    warning: "border border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100",
    ghost: "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
