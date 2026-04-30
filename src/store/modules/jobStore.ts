import { create } from 'zustand';
import { storage } from '../../lib/storage';

export type JobStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';
export type JobPriority = 'low' | 'medium' | 'high';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  status: JobStatus;
  priority: JobPriority;
  salary?: string;
  description?: string;
  url?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobState {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  moveJob: (id: string, newStatus: JobStatus) => void;
  getJobsByStatus: (status: JobStatus) => Job[];
  getJobsByCompany: (company: string) => Job[];
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: storage.get('jobs', []),

  addJob: (job) => {
    const newJob: Job = {
      ...job,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => {
      const jobs = [...state.jobs, newJob];
      storage.set('jobs', jobs);
      return { jobs };
    });
  },

  updateJob: (id, updates) => {
    set((state) => {
      const jobs = state.jobs.map((job) =>
        job.id === id
          ? { ...job, ...updates, updatedAt: new Date().toISOString() }
          : job
      );
      storage.set('jobs', jobs);
      return { jobs };
    });
  },

  deleteJob: (id) => {
    set((state) => {
      const jobs = state.jobs.filter((job) => job.id !== id);
      storage.set('jobs', jobs);
      return { jobs };
    });
  },

  moveJob: (id, newStatus) => {
    get().updateJob(id, { status: newStatus });
  },

  getJobsByStatus: (status) => {
    return get().jobs.filter((job) => job.status === status);
  },

  getJobsByCompany: (company) => {
    return get().jobs.filter((job) => job.company === company);
  },
}));
