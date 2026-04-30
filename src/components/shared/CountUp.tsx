import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
}

export function CountUp({ value, duration = 1, className }: CountUpProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: [0.25, 0.8, 0.25, 1],
    });
    return controls.stop;
  }, [count, value, duration]);

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
}
