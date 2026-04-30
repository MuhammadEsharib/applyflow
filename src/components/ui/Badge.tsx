import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xl border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        {
          // White/Black/Blue theme
          'bg-black/4 text-black': variant === 'default',
          'bg-blue-50 text-blue-600 border-blue-200': variant === 'success',
          'bg-blue-100 text-blue-700 border-blue-300': variant === 'warning',
          'bg-red-50 text-red-600 border-red-200': variant === 'error',
          'bg-blue-500 text-white border-blue-500': variant === 'info',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
