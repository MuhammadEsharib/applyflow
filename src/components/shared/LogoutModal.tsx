import { motion } from 'framer-motion';
import { AlertTriangle, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} title="" size="sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4"
          >
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </motion.div>

          <h3 className="text-xl font-bold text-black mb-2">
            Confirm Logout
          </h3>

          <p className="text-black/70 mb-6 leading-relaxed">
            Are you sure you want to log out? Your data will be saved locally and you can return anytime.
          </p>

          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white border-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
}
