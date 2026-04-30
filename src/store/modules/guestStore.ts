import { create } from 'zustand';
import { storage } from '../../lib/storage';
import type { Job } from './jobStore';

export type DemoProfile = 'developer' | 'freelancer' | 'student' | 'manager' | 'designer' | 'researcher';

interface GuestState {
  isGuestMode: boolean;
  demoDataLoaded: boolean;
  selectedProfile: DemoProfile | null;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
  loadDemoData: (profile: DemoProfile) => void;
  clearDemoData: () => void;
  setSelectedProfile: (profile: DemoProfile | null) => void;
}

const demoProfiles: Record<DemoProfile, Omit<Job, 'id' | 'createdAt' | 'updatedAt'>[]> = {
  developer: [
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
    {
      title: 'Frontend Developer',
      company: 'Airbnb',
      location: 'Remote',
      status: 'interview',
      priority: 'high',
      salary: '$155k - $195k',
      description: 'Create amazing travel experiences',
    },
  ],
  freelancer: [
    {
      title: 'UI/UX Designer',
      company: 'Upwork Client',
      location: 'Remote',
      status: 'applied',
      priority: 'medium',
      salary: '$80/hr',
      description: 'Design mobile app for startup',
    },
    {
      title: 'Web Developer',
      company: 'Fiverr',
      location: 'Remote',
      status: 'offer',
      priority: 'high',
      salary: '$100/hr',
      description: 'Build e-commerce website',
    },
    {
      title: 'React Developer',
      company: 'Toptal',
      location: 'Remote',
      status: 'interview',
      priority: 'high',
      salary: '$120/hr',
      description: 'Enterprise dashboard project',
    },
    {
      title: 'Full Stack Developer',
      company: 'Freelance',
      location: 'Remote',
      status: 'wishlist',
      priority: 'medium',
      salary: '$90/hr',
      description: 'SaaS MVP development',
    },
    {
      title: 'Mobile App Developer',
      company: 'Upwork Enterprise',
      location: 'Remote',
      status: 'applied',
      priority: 'high',
      salary: '$95/hr',
      description: 'iOS and Android app development',
    },
  ],
  student: [
    {
      title: 'Junior Developer',
      company: 'Tech Startup',
      location: 'New York, NY',
      status: 'applied',
      priority: 'medium',
      salary: '$65k - $75k',
      description: 'Entry-level position for recent grad',
    },
    {
      title: 'Software Engineer Intern',
      company: 'Google',
      location: 'Mountain View, CA',
      status: 'interview',
      priority: 'high',
      salary: '$45/hr',
      description: 'Summer internship program',
    },
    {
      title: 'Frontend Developer',
      company: 'Local Agency',
      location: 'Austin, TX',
      status: 'wishlist',
      priority: 'low',
      salary: '$55k - $65k',
      description: 'Junior role with growth potential',
    },
    {
      title: 'Web Developer',
      company: 'E-commerce Company',
      location: 'Seattle, WA',
      status: 'applied',
      priority: 'medium',
      salary: '$60k - $70k',
      description: 'Recent graduate position',
    },
    {
      title: 'Data Analyst Intern',
      company: 'Microsoft',
      location: 'Redmond, WA',
      status: 'wishlist',
      priority: 'high',
      salary: '$40/hr',
      description: 'Data analysis and visualization',
    },
  ],
  manager: [
    {
      title: 'Engineering Manager',
      company: 'Meta',
      location: 'Menlo Park, CA',
      status: 'interview',
      priority: 'high',
      salary: '$250k - $300k',
      description: 'Lead a team of 15 engineers',
    },
    {
      title: 'Product Manager',
      company: 'Amazon',
      location: 'Seattle, WA',
      status: 'applied',
      priority: 'high',
      salary: '$200k - $250k',
      description: 'Manage AWS product roadmap',
    },
    {
      title: 'Technical Program Manager',
      company: 'Google',
      location: 'Mountain View, CA',
      status: 'wishlist',
      priority: 'medium',
      salary: '$180k - $220k',
      description: 'Coordinate cross-functional teams',
    },
    {
      title: 'Director of Engineering',
      company: 'Stripe',
      location: 'San Francisco, CA',
      status: 'offer',
      priority: 'high',
      salary: '$350k - $400k',
      description: 'Lead engineering organization',
    },
    {
      title: 'VP of Product',
      company: 'Series B Startup',
      location: 'Remote',
      status: 'applied',
      priority: 'high',
      salary: '$300k + equity',
      description: 'Build product strategy and team',
    },
  ],
  designer: [
    {
      title: 'Senior Product Designer',
      company: 'Figma',
      location: 'San Francisco, CA',
      status: 'interview',
      priority: 'high',
      salary: '$160k - $200k',
      description: 'Design core product features',
    },
    {
      title: 'UX Researcher',
      company: 'Google',
      location: 'Mountain View, CA',
      status: 'applied',
      priority: 'medium',
      salary: '$140k - $180k',
      description: 'Conduct user research studies',
    },
    {
      title: 'Design Lead',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      status: 'wishlist',
      priority: 'high',
      salary: '$180k - $220k',
      description: 'Lead design team for new features',
    },
    {
      title: 'Brand Designer',
      company: 'Notion',
      location: 'Remote',
      status: 'offer',
      priority: 'high',
      salary: '$150k - $190k',
      description: 'Shape brand identity and systems',
    },
    {
      title: 'Motion Designer',
      company: 'Linear',
      location: 'Remote',
      status: 'applied',
      priority: 'medium',
      salary: '$130k - $170k',
      description: 'Create animations and interactions',
    },
  ],
  researcher: [
    {
      title: 'Machine Learning Engineer',
      company: 'OpenAI',
      location: 'San Francisco, CA',
      status: 'interview',
      priority: 'high',
      salary: '$220k - $280k',
      description: 'Build ML models for AI products',
    },
    {
      title: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      status: 'applied',
      priority: 'high',
      salary: '$180k - $230k',
      description: 'Analyze user behavior and recommendations',
    },
    {
      title: 'Research Scientist',
      company: 'DeepMind',
      location: 'London, UK',
      status: 'wishlist',
      priority: 'high',
      salary: '$200k - $260k',
      description: 'Research in reinforcement learning',
    },
    {
      title: 'AI Research Engineer',
      company: 'Anthropic',
      location: 'San Francisco, CA',
      status: 'offer',
      priority: 'high',
      salary: '$250k - $320k',
      description: 'Work on AI safety research',
    },
    {
      title: 'Applied Scientist',
      company: 'Amazon AWS',
      location: 'Seattle, WA',
      status: 'applied',
      priority: 'medium',
      salary: '$190k - $240k',
      description: 'Apply ML to AWS services',
    },
  ],
};

export const useGuestStore = create<GuestState>((set) => ({
  isGuestMode: storage.get('guest', { isGuestMode: false }).isGuestMode,
  demoDataLoaded: false,
  selectedProfile: null,

  enableGuestMode: () => {
    set(() => {
      storage.set('guest', { isGuestMode: true });
      return { isGuestMode: true };
    });
  },

  disableGuestMode: () => {
    set(() => {
      storage.set('guest', { isGuestMode: false });
      return { isGuestMode: false, demoDataLoaded: false, selectedProfile: null };
    });
  },

  loadDemoData: (profile: DemoProfile) => {
    const jobs = storage.get('jobs', []);
    if (jobs.length === 0) {
      const profileJobs = demoProfiles[profile];
      const newJobs = profileJobs.map((job) => ({
        ...job,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      storage.set('jobs', newJobs);
      set({ demoDataLoaded: true, selectedProfile: profile });
    }
  },

  clearDemoData: () => {
    storage.remove('jobs');
    storage.remove('activity');
    storage.remove('notifications');
    set({ demoDataLoaded: false, selectedProfile: null });
  },

  setSelectedProfile: (profile) => {
    set({ selectedProfile: profile });
  },
}));
