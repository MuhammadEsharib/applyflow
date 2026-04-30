import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { shimmer, motionConfig } from '../../lib/motion';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      className={cn(
        'rounded-xl bg-black/4',
        'bg-linear-to-r from-black/4 via-black/2 to-black/4',
        'bg-size-[200%_100%]',
        className
      )}
      variants={shimmer}
      animate="animate"
    />
  );
}

export function CardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionConfig.smooth}
      className="rounded-2xl border border-border bg-white p-6"
    >
      <Skeleton className="h-5 w-3/4 mb-3" />
      <Skeleton className="h-4 w-1/2 mb-6" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </motion.div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={motionConfig.smooth}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-11 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-white p-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-10 w-16" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-white p-6">
          <Skeleton className="h-5 w-32 mb-4" />
          <ListSkeleton count={3} />
        </div>
        <div className="rounded-2xl border border-border bg-white p-6">
          <Skeleton className="h-5 w-32 mb-4" />
          <ListSkeleton count={3} />
        </div>
      </div>
    </motion.div>
  );
}
