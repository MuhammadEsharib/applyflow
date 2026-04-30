import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asChild?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return <>{children}</>;
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'hover:scale-[1.02] active:scale-[0.98]',
          {
            // Primary: Blue accent with white text
            'bg-blue-500 text-white border border-blue-500 shadow-high-key hover:bg-blue-600 hover:shadow-glow-blue': variant === 'primary',
            // Secondary: #000000 text on rgba(0,0,0,0.04) background
            'bg-black/4 text-black hover:bg-black/8 hover:shadow-glow': variant === 'secondary',
            // Ghost: Minimalist hover state with blue accent
            'text-black hover:bg-blue-50 hover:text-blue-600': variant === 'ghost',
            // Outline: Border with transparent background
            'bg-transparent text-black border border-black/10 hover:bg-black/4': variant === 'outline',
          },
          {
            'h-9 px-3 text-sm': size === 'sm',
            'h-11 px-4 py-2': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
