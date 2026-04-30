import { create } from 'zustand';
import { storage } from '../../lib/storage';

export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'application' | 'interview' | 'offer' | 'reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  metadata?: {
    applicationId?: string;
    companyName?: string;
    jobId?: string;
    action?: string;
    [key: string]: unknown;
  };
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  addApplicationNotification: (action: string, companyName: string, applicationId: string) => void;
  addInterviewNotification: (companyName: string, applicationId: string) => void;
  addOfferNotification: (companyName: string, applicationId: string) => void;
  addReminderNotification: (title: string, message: string, applicationId?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  markAsUnread: (id: string) => void;
  deleteNotification: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  bulkMarkAsRead: (ids: string[]) => void;
  clearAll: () => void;
  clearRead: () => void;
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: NotificationType) => Notification[];
  getRecentNotifications: (limit?: number) => Notification[];
}

export const useNotificationStore = create<NotificationState>((set, get) => {
  const notifications = storage.get('notifications', []);
  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: Notification) => !n.read).length : 0;

  return {
    notifications: Array.isArray(notifications) ? notifications : [],
    unreadCount,

    addNotification: (notification) => {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const notifications = [newNotification, ...state.notifications];
        storage.set('notifications', notifications);
        return {
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        };
      });
    },

    addApplicationNotification: (action, companyName, applicationId) => {
      const actionMessages = {
        created: { title: 'Application Created', message: `Successfully applied to ${companyName}`, type: 'success' as const },
        updated: { title: 'Application Updated', message: `Application to ${companyName} has been updated`, type: 'info' as const },
        archived: { title: 'Application Archived', message: `Application to ${companyName} has been archived`, type: 'info' as const },
        deleted: { title: 'Application Deleted', message: `Application to ${companyName} has been deleted`, type: 'warning' as const },
        moved: { title: 'Application Moved', message: `Application to ${companyName} status has been changed`, type: 'info' as const }
      };

      const message = actionMessages[action as keyof typeof actionMessages];
      if (message) {
        get().addNotification({
          type: 'application',
          title: message.title,
          message: message.message,
          metadata: { applicationId, companyName, action }
        });
      }
    },

    addInterviewNotification: (companyName, applicationId) => {
      get().addNotification({
        type: 'interview',
        title: 'Interview Scheduled',
        message: `Interview scheduled with ${companyName}`,
        metadata: { applicationId, companyName }
      });
    },

    addOfferNotification: (companyName, applicationId) => {
      get().addNotification({
        type: 'offer',
        title: 'Offer Received!',
        message: `Congratulations! You received an offer from ${companyName}`,
        metadata: { applicationId, companyName }
      });
    },

    addReminderNotification: (title, message, applicationId) => {
      get().addNotification({
        type: 'reminder',
        title,
        message,
        metadata: { applicationId }
      });
    },

    markAsRead: (id) => {
      set((state) => {
        const notifications = state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        storage.set('notifications', notifications);
        return {
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        };
      });
    },

    markAllAsRead: () => {
      set((state) => {
        const notifications = state.notifications.map((n) => ({ ...n, read: true }));
        storage.set('notifications', notifications);
        return {
          notifications,
          unreadCount: 0,
        };
      });
    },

    markAsUnread: (id) => {
      set((state) => {
        const notifications = state.notifications.map((n) =>
          n.id === id ? { ...n, read: false } : n
        );
        storage.set('notifications', notifications);
        return {
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        };
      });
    },

    deleteNotification: (id) => {
      set((state) => {
        const notifications = state.notifications.filter((n) => n.id !== id);
        storage.set('notifications', notifications);
        return {
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        };
      });
    },

    bulkDelete: (ids) => {
      set((state) => {
        const notifications = state.notifications.filter((n) => !ids.includes(n.id));
        storage.set('notifications', notifications);
        return {
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        };
      });
    },

    bulkMarkAsRead: (ids) => {
      set((state) => {
        const notifications = state.notifications.map((n) =>
          ids.includes(n.id) ? { ...n, read: true } : n
        );
        storage.set('notifications', notifications);
        return {
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        };
      });
    },

    clearAll: () => {
      set(() => {
        storage.set('notifications', []);
        return {
          notifications: [],
          unreadCount: 0,
        };
      });
    },

    clearRead: () => {
      set((state) => {
        const notifications = state.notifications.filter((n) => !n.read);
        storage.set('notifications', notifications);
        return {
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        };
      });
    },

    getUnreadNotifications: () => {
      return get().notifications.filter((n) => !n.read);
    },

    getNotificationsByType: (type) => {
      return get().notifications.filter((n) => n.type === type);
    },

    getRecentNotifications: (limit = 5) => {
      return get().notifications.slice(0, limit);
    },
  };
});
