import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../../lib/storage';

export interface ActivityItem {
  id: string;
  type: 'create' | 'edit' | 'delete' | 'move' | 'share' | 'status_change';
  entityType: 'application' | 'company' | 'note';
  entityId: string;
  entityName: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface ActivityState {
  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  getActivities: (limit?: number) => ActivityItem[];
  getActivitiesByEntity: (entityId: string) => ActivityItem[];
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [],

      addActivity: (activity) => {
        const newActivity: ActivityItem = {
          ...activity,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          activities: [newActivity, ...state.activities].slice(0, 100), // Keep only last 100 activities
        }));
      },

      getActivities: (limit = 50) => {
        return get().activities.slice(0, limit);
      },

      getActivitiesByEntity: (entityId: string) => {
        return get().activities.filter(activity => activity.entityId === entityId);
      },

      clearActivities: () => {
        set({ activities: [] });
      },
    }),
    {
      name: 'activity-storage',
      storage: createJSONStorage(() => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getItem: (key) => storage.get(key as any, null),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setItem: (key, value) => storage.set(key as any, value),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        removeItem: (key) => storage.remove(key as any),
      })),
      partialize: (state) => ({ activities: state.activities }),
    }
  )
);

// Helper functions for common activity types
export const activityHelpers = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applicationCreated: (entityId: string, entityName: string, metadata?: any) => ({
    type: 'create' as const,
    entityType: 'application' as const,
    entityId,
    entityName,
    description: `Created application for ${entityName}`,
    metadata,
  }),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applicationUpdated: (entityId: string, entityName: string, metadata?: any) => ({
    type: 'edit' as const,
    entityType: 'application' as const,
    entityId,
    entityName,
    description: `Updated application for ${entityName}`,
    metadata,
  }),

  applicationEdited: (entityId: string, entityName: string, changes?: string[]) => ({
    type: 'edit' as const,
    entityType: 'application' as const,
    entityId,
    entityName,
    description: `Updated application for ${entityName}${changes ? `: ${changes.join(', ')}` : ''}`,
    metadata: { changes },
  }),

  applicationDeleted: (entityId: string, entityName: string) => ({
    type: 'delete' as const,
    entityType: 'application' as const,
    entityId,
    entityName,
    description: `Deleted application for ${entityName}`,
  }),

  applicationMoved: (entityId: string, entityName: string, fromStatus: string, toStatus: string) => ({
    type: 'move' as const,
    entityType: 'application' as const,
    entityId,
    entityName,
    description: `Moved ${entityName} from ${fromStatus} to ${toStatus}`,
    metadata: { fromStatus, toStatus },
  }),

  applicationShared: (entityId: string, entityName: string, shareMethod: string, recipient?: string) => ({
    type: 'share' as const,
    entityType: 'application' as const,
    entityId,
    entityName,
    description: `Shared ${entityName} via ${shareMethod}${recipient ? ` with ${recipient}` : ''}`,
    metadata: { shareMethod, recipient },
  }),

  statusChanged: (entityId: string, entityName: string, fromStatus: string, toStatus: string) => ({
    type: 'status_change' as const,
    entityType: 'application' as const,
    entityId,
    entityName,
    description: `Status changed for ${entityName}: ${fromStatus} → ${toStatus}`,
    metadata: { fromStatus, toStatus },
  }),
};