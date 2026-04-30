import { create } from 'zustand';
import { storage } from '../../lib/storage';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadNotifications: () => Notification[];
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

    clearAll: () => {
      set(() => {
        storage.set('notifications', []);
        return {
          notifications: [],
          unreadCount: 0,
        };
      });
    },

    getUnreadNotifications: () => {
      return get().notifications.filter((n) => !n.read);
    },
  };
});