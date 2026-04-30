import { Fragment, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { modalAnimation } from '../../lib/motion';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full' | 'responsive';
}

export function Dialog({ open, onClose, title, children, size = 'md' }: DialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[12px]"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                'relative w-full rounded-2xl bg-white shadow-high-key border border-border',
                {
                  'max-w-sm': size === 'sm',
                  'max-w-md': size === 'md',
                  'max-w-lg': size === 'lg',
                  'max-w-2xl': size === 'xl',
                  'max-w-3xl': size === '2xl',
                  'max-w-4xl': size === '3xl',
                  'max-w-5xl': size === '4xl',
                  'w-full h-full': size === 'full',
                  'w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl': size === 'responsive',
                }
              )}
            >
              {title && (
                <div className="flex items-center justify-between border-b border-border p-6">
                  <h2 className="text-xl font-bold text-black">{title}</h2>
                  <button
                    onClick={onClose}
                    className="rounded-xl p-2 text-black/40 transition-colors hover:bg-black/4 hover:text-black"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}