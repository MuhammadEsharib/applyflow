import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Mail, Link, Download, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Dialog } from '../ui/Dialog';
import { ApplicationSharing } from '../../utils/sharing';
import { useActivityStore, activityHelpers } from '../../store/modules/activityStore';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import { cn } from '../../lib/utils';
import type { Job } from '../../features';

interface ApplicationShareProps {
  isOpen: boolean;
  onClose: () => void;
  application: Job;
}

export function ApplicationShare({ isOpen, onClose, application }: ApplicationShareProps) {
  const [shareMethod, setShareMethod] = useState<'email' | 'link' | 'social' | 'export'>('link');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { addActivity } = useActivityStore();
  const { settingsChanged } = useToastNotifications();

  const shareableApp = ApplicationSharing.createShareableApplication(application);
  const shareLink = ApplicationSharing.generateShareLink(shareableApp);

  const handleCopyLink = async () => {
    try {
      await ApplicationSharing.copyToClipboard(shareableApp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      settingsChanged('Link copied to clipboard');
    } catch {
      settingsChanged('Failed to copy link');
    }
  };

  const handleEmailShare = async () => {
    setIsSharing(true);
    try {
      await ApplicationSharing.shareViaEmail(shareableApp, recipientEmail || undefined);
      addActivity(activityHelpers.applicationShared(
        application.id,
        `${application.title} at ${application.company}`,
        'email',
        recipientEmail || 'recipient'
      ));
      settingsChanged('Email share initiated');
      onClose();
    } catch {
      settingsChanged('Failed to share via email');
    } finally {
      setIsSharing(false);
    }
  };

  const handleSocialShare = async (platform: 'twitter' | 'linkedin') => {
    setIsSharing(true);
    try {
      if (platform === 'twitter') {
        await ApplicationSharing.shareViaTwitter(shareableApp);
      } else {
        await ApplicationSharing.shareViaLinkedIn(shareableApp);
      }
      addActivity(activityHelpers.applicationShared(
        application.id,
        `${application.title} at ${application.company}`,
        platform
      ));
      settingsChanged(`${platform.charAt(0).toUpperCase() + platform.slice(1)} share initiated`);
    } catch {
      settingsChanged(`Failed to share via ${platform}`);
    } finally {
      setIsSharing(false);
    }
  };

  const handleExport = async (format: 'json' | 'pdf') => {
    setIsSharing(true);
    try {
      if (format === 'json') {
        await ApplicationSharing.exportAsJSON(shareableApp);
      } else {
        await ApplicationSharing.exportAsPDF(shareableApp);
      }
      addActivity(activityHelpers.applicationShared(
        application.id,
        `${application.title} at ${application.company}`,
        `export-${format}`
      ));
      settingsChanged(`Application exported as ${format.toUpperCase()}`);
    } catch {
      settingsChanged(`Failed to export as ${format}`);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title="Share Application" size="md">
      <div className="space-y-6">
        {/* Application Preview */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
            {application.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {application.company} • {application.location}
          </p>
        </div>

        {/* Share Method Selection */}
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {[
            { id: 'link' as const, label: 'Link', icon: Link },
            { id: 'email' as const, label: 'Email', icon: Mail },
            { id: 'social' as const, label: 'Social', icon: Share2 },
            { id: 'export' as const, label: 'Export', icon: Download },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setShareMethod(id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                shareMethod === id
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Share Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={shareMethod}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {shareMethod === 'link' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Share Link
                </label>
                <div className="flex gap-2">
                  <Input
                    value={shareLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Anyone with this link can view the application details
                </p>
              </div>
            )}

            {shareMethod === 'email' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Recipient Email (Optional)
                </label>
                <Input
                  type="email"
                  placeholder="Enter email address..."
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
                <Button
                  onClick={handleEmailShare}
                  disabled={isSharing}
                  className="w-full"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {isSharing ? 'Opening Email...' : 'Share via Email'}
                </Button>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Opens your default email client with application details
                </p>
              </div>
            )}

            {shareMethod === 'social' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleSocialShare('twitter')}
                    disabled={isSharing}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => handleSocialShare('linkedin')}
                    disabled={isSharing}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    LinkedIn
                  </Button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Share this opportunity on your social networks
                </p>
              </div>
            )}

            {shareMethod === 'export' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleExport('json')}
                    disabled={isSharing}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    JSON
                  </Button>
                  <Button
                    onClick={() => handleExport('pdf')}
                    disabled={isSharing}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    PDF/Text
                  </Button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Download application data for offline use
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}