import type { LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      {Icon && (
        <div className="mb-4 rounded-full bg-black/4 p-4">
          <Icon className="h-8 w-8 text-black" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2 text-black">{title}</h3>
      <p className="text-black/70 mb-4 max-w-sm">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
