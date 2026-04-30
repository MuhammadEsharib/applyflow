import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle, X, ArrowDown, Briefcase, Calendar, Star, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNotificationStore } from '../../features';
import type { Notification } from '../../features';

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
  onNavigateToApplication?: (applicationId: string) => void;
  onViewAllNotifications?: () => void;
}

const notificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  application: Briefcase,
  interview: Calendar,
  offer: Star,
  reminder: Clock,
};

const notificationColors = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-rose-50 border-rose-200 text-rose-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  application: 'bg-blue-50 border-blue-200 text-blue-800',
  interview: 'bg-purple-50 border-purple-200 text-purple-800',
  offer: 'bg-green-50 border-green-200 text-green-800',
  reminder: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

export function NotificationCenter({ open, onClose, onNavigateToApplication, onViewAllNotifications }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getRecentNotifications
  } = useNotificationStore();

  const [scrolledToBottom, setScrolledToBottom] = useState(true);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const recentNotifications = getRecentNotifications(10);

  const handleScroll = useCallback(() => {
    if (notificationsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = notificationsRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setScrolledToBottom(isAtBottom);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (notificationsRef.current) {
      notificationsRef.current.scrollTop = notificationsRef.current.scrollHeight;
    }
  }, []);

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate to application if metadata exists and callback is provided
    if (notification.metadata?.applicationId && onNavigateToApplication) {
      onNavigateToApplication(notification.metadata.applicationId);
      onClose();
    }
  };

  const handleViewAll = () => {
    if (onViewAllNotifications) {
      onViewAllNotifications();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="fixed top-16 right-4 lg:right-8 z-50 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  />
                )}
              </div>
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium"
                >
                  {unreadCount}
                </motion.span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Actions */}
          {recentNotifications.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-200">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-xs text-blue-600 hover:underline disabled:text-slate-400 disabled:no-underline"
              >
                Mark all as read
              </button>
              <button
                onClick={clearAll}
                disabled={recentNotifications.length === 0}
                className="text-xs text-rose-600 hover:underline disabled:text-slate-400 disabled:no-underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div
            ref={notificationsRef}
            onScroll={handleScroll}
            className="max-h-96 overflow-y-auto scrollbar-thin"
          >
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {recentNotifications.map((notification) => {
                  const Icon = notificationIcons[notification.type] || Bell;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        'p-4 hover:bg-slate-50 transition-colors cursor-pointer',
                        !notification.read && 'bg-blue-50/50'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                          notificationColors[notification.type]
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className={cn(
                                'text-sm font-medium',
                                !notification.read ? 'text-slate-900 font-semibold' : 'text-slate-700'
                              )}>
                                {notification.title}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-slate-400">
                                  {formatTimestamp(notification.createdAt)}
                                </span>
                                {notification.action && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      notification.action!.onClick();
                                    }}
                                    className="text-xs text-blue-600 hover:underline"
                                  >
                                    {notification.action.label}
                                  </button>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="w-6 h-6 rounded hover:bg-slate-200 flex items-center justify-center transition-colors opacity-0 hover:opacity-100"
                            >
                              <X className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scroll to bottom indicator */}
          {!scrolledToBottom && recentNotifications.length > 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
            >
              <button
                onClick={scrollToBottom}
                className="bg-white border border-slate-200 rounded-full p-2 shadow-lg hover:bg-slate-50 transition-colors"
              >
                <ArrowDown className="w-4 h-4 text-slate-600" />
              </button>
            </motion.div>
          )}

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <button
              onClick={handleViewAll}
              className="w-full text-xs text-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              View all notifications ({notifications.length})
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}