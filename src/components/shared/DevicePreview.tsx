import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Tablet, Smartphone, Laptop, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Device {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  width: number;
  height: number;
  scale: number;
  description: string;
}

const devices: Device[] = [
  {
    name: 'Mobile',
    icon: Smartphone,
    width: 375,
    height: 667,
    scale: 0.8,
    description: 'iPhone SE'
  },
  {
    name: 'Tablet',
    icon: Tablet,
    width: 768,
    height: 1024,
    scale: 0.7,
    description: 'iPad'
  },
  {
    name: 'Laptop',
    icon: Laptop,
    width: 1366,
    height: 768,
    scale: 0.6,
    description: 'MacBook Air'
  },
  {
    name: 'Desktop',
    icon: Monitor,
    width: 1920,
    height: 1080,
    scale: 0.5,
    description: 'iMac'
  }
];

interface DevicePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function DevicePreview({ isOpen, onClose, children }: DevicePreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device>(devices[2]); // Default to Laptop

  const handleDeviceSelect = useCallback((device: Device) => {
    setSelectedDevice(device);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-2xl shadow-high-key-lg overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-black">Device Preview</h2>
              <div className="flex items-center gap-2 text-sm text-black/60">
                <span>{selectedDevice.name}</span>
                <span>•</span>
                <span>{selectedDevice.description}</span>
                <span>•</span>
                <span>{selectedDevice.width} × {selectedDevice.height}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-black/4 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-black/60" />
            </button>
          </div>

          {/* Device Selector */}
          <div className="flex items-center justify-center gap-2 p-4 border-b border-border">
            {devices.map((device) => {
              const Icon = device.icon;
              const isSelected = selectedDevice.name === device.name;

              return (
                <button
                  key={device.name}
                  onClick={() => handleDeviceSelect(device)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200",
                    isSelected
                      ? "bg-black text-white shadow-high-key"
                      : "bg-black/4 text-black/60 hover:bg-black/8"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{device.name}</span>
                </button>
              );
            })}
          </div>

          {/* Preview Area */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-black/4 to-black/2">
            <motion.div
              key={selectedDevice.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-lg shadow-high-key-lg overflow-hidden"
              style={{
                width: selectedDevice.width * selectedDevice.scale,
                height: selectedDevice.height * selectedDevice.scale,
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            >
              {/* Device Frame */}
              <div className="absolute inset-0 border-8 border-black/20 rounded-lg pointer-events-none">
                {/* Notch for mobile */}
                {selectedDevice.name === 'Mobile' && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black/20 rounded-b-2xl" />
                )}
              </div>

              {/* Content */}
              <div className="w-full h-full overflow-auto">
                <div style={{ transform: `scale(${1 / selectedDevice.scale})`, transformOrigin: 'top left' }}>
                  {children}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between p-4 border-t border-border bg-black/2">
            <div className="flex items-center gap-4">
              <div className="text-sm text-black/60">
                Scale: {Math.round(selectedDevice.scale * 100)}%
              </div>
              <div className="text-sm text-black/60">
                Viewport: {selectedDevice.width} × {selectedDevice.height}px
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open(window.location.href, '_blank')}
                className="px-4 py-2 bg-black hover:bg-black/80 text-white rounded-lg transition-colors text-sm font-medium shadow-high-key hover:shadow-high-key-hover"
              >
                Open in New Tab
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}