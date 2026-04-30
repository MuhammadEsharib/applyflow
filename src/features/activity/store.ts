import { create } from 'zustand';
import { storage } from '../../lib/storage';

export type ActivityType = 'job_added' | 'job_updated' | 'job_deleted' | 'job_moved' | 'company_added' | 'note_added';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

interface ActivityState {
  activities: Activity[];
  filter: string;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  deleteActivity: (id: string) => void;
  setFilter: (filter: string) => void;
  getFilteredActivities: () => Activity[];
  clearAll: () => void;
}

export const useActivityStore = create<ActivityState>((set, get) => {
  const activities = storage.get('activity', []);
  return {
    activities: Array.isArray(activities) ? activities : [],
    filter: '',

    addActivity: (activity) => {
      const newActivity: Activity = {
        ...activity,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const activities = [newActivity, ...state.activities];
        storage.set('activity', activities);
        return { activities };
      });
    },

    deleteActivity: (id) => {
      set((state) => {
        const activities = state.activities.filter((a) => a.id !== id);
        storage.set('activity', activities);
        return { activities };
      });
    },

    setFilter: (filter) => {
      set({ filter });
    },

    getFilteredActivities: () => {
      const { activities, filter } = get();
      if (!filter) return activities;
      return activities.filter((a) =>
        a.title.toLowerCase().includes(filter.toLowerCase()) ||
        a.description.toLowerCase().includes(filter.toLowerCase())
      );
    },

    clearAll: () => {
      set(() => {
        storage.set('activity', []);
        return { activities: [] };
      });
    },
  };
});
