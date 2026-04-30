import { create } from 'zustand';
import { storage } from '../../lib/storage';
import type { Job } from '../jobs';

interface GuestState {
  isGuestMode: boolean;
  demoDataLoaded: boolean;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
  loadDemoData: () => void;
  clearDemoData: () => void;
}

const demoJobs: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    status: 'interview',
    priority: 'high',
    salary: '$180k - $220k',
    description: 'Build beautiful payment interfaces',
  },
  {
    title: 'Product Designer',
    company: 'Linear',
    location: 'Remote',
    status: 'applied',
    priority: 'medium',
    salary: '$140k - $180k',
    description: 'Design next-gen project management tools',
  },
  {
    title: 'Full Stack Developer',
    company: 'Notion',
    location: 'San Francisco, CA',
    status: 'wishlist',
    priority: 'high',
    salary: '$160k - $200k',
    description: 'Build the future of productivity',
  },
  {
    title: 'React Developer',
    company: 'Vercel',
    location: 'Remote',
    status: 'offer',
    priority: 'high',
    salary: '$170k - $210k',
    description: 'Work on Next.js and developer tools',
  },
  {
    title: 'Software Engineer',
    company: 'Figma',
    location: 'San Francisco, CA',
    status: 'applied',
    priority: 'medium',
    salary: '$150k - $190k',
    description: 'Build collaborative design tools',
  },
];

export const useGuestStore = create<GuestState>((set) => {
  const guestData = storage.get('guest', { isGuestMode: false });
  return {
    isGuestMode: guestData?.isGuestMode || false,
    demoDataLoaded: false,

  enableGuestMode: () => {
    set(() => {
      storage.set('guest', { isGuestMode: true });
      return { isGuestMode: true };
    });
  },

  disableGuestMode: () => {
    set(() => {
      storage.set('guest', { isGuestMode: false });
      return { isGuestMode: false, demoDataLoaded: false };
    });
  },

  loadDemoData: () => {
    const jobs = storage.get('jobs', []);
    if (!Array.isArray(jobs) || jobs.length === 0) {
      const newJobs = demoJobs.map((job) => ({
        ...job,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      storage.set('jobs', newJobs);
      set({ demoDataLoaded: true });
    }
  },

  clearDemoData: () => {
    storage.remove('jobs');
    storage.remove('activity');
    storage.remove('notifications');
    set({ demoDataLoaded: false });
  },
  };
});
