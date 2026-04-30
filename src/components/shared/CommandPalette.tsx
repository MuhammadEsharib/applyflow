import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Users, Settings, BarChart3, Briefcase, Activity, Bell, LogOut, User, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useJobStore } from '../../features/jobs/store';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  action?: () => void;
  category: 'navigation' | 'actions' | 'settings' | 'search';
  keywords?: string[];
  type?: 'job' | 'command';
}

interface JobSearchResult {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  category: 'search';
  type: 'job';
  jobId: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { jobs } = useJobStore();

  const navigateToPath = useCallback((path: string) => {
    window.location.href = path;
  }, []);

  const openApplicationModal = useCallback(() => {
    window.location.href = '/app/applications';
    setTimeout(() => {
      const event = new CustomEvent('openAddApplicationModal');
      window.dispatchEvent(event);
    }, 100);
  }, []);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'View your application dashboard',
      icon: BarChart3,
      path: '/app/dashboard',
      category: 'navigation',
      keywords: ['home', 'overview', 'stats']
    },
    {
      id: 'applications',
      title: 'Applications',
      description: 'Manage job applications',
      icon: Briefcase,
      path: '/app/applications',
      category: 'navigation',
      keywords: ['jobs', 'pipeline', 'opportunities']
    },
    {
      id: 'activity',
      title: 'Activity',
      description: 'View recent activity',
      icon: Activity,
      path: '/app/activity',
      category: 'navigation',
      keywords: ['feed', 'history', 'recent']
    },
    {
      id: 'companies',
      title: 'Companies',
      description: 'Browse companies',
      icon: Users,
      path: '/app/companies',
      category: 'navigation',
      keywords: ['organizations', 'employers']
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View application analytics',
      icon: FileText,
      path: '/app/analytics',
      category: 'navigation',
      keywords: ['reports', 'insights', 'metrics']
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Manage account settings',
      icon: Settings,
      path: '/app/settings',
      category: 'navigation',
      keywords: ['preferences', 'profile', 'account']
    },
    {
      id: 'help',
      title: 'Help Center',
      description: 'Get help and support',
      icon: HelpCircle,
      path: '/app/help',
      category: 'navigation',
      keywords: ['support', 'faq', 'documentation']
    },
    // Actions
    {
      id: 'new-application',
      title: 'New Application',
      description: 'Add a new job application',
      icon: Briefcase,
      action: openApplicationModal,
      category: 'actions',
      keywords: ['add', 'create', 'job', 'opportunity']
    },
    // Settings
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'View notification settings',
      icon: Bell,
      action: () => navigateToPath('/app/settings?tab=notifications'),
      category: 'settings',
      keywords: ['alerts', 'messages']
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Edit your profile',
      icon: User,
      action: () => navigateToPath('/app/settings?tab=profile'),
      category: 'settings',
      keywords: ['account', 'personal']
    },
    {
      id: 'logout',
      title: 'Logout',
      description: 'Sign out of your account',
      icon: LogOut,
      action: () => {
        // Handle logout logic
        console.log('Logout');
      },
      category: 'settings',
      keywords: ['signout', 'exit']
    }
  ];

  const filteredCommands = commands.filter(command => {
    const query = searchQuery.toLowerCase();
    return (
      command.title.toLowerCase().includes(query) ||
      command.description?.toLowerCase().includes(query) ||
      command.keywords?.some(keyword => keyword.toLowerCase().includes(query))
    );
  });

  // Search jobs if query exists
  const jobResults = useMemo(() => {
    if (searchQuery.length === 0) return [];
    return jobs.filter(job => {
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.status.toLowerCase().includes(query)
      );
    }).slice(0, 5).map(job => ({
      id: job.id,
      title: job.title,
      description: `${job.company} • ${job.status}`,
      icon: Briefcase,
      path: '/app/applications',
      category: 'search' as const,
      type: 'job' as const,
      jobId: job.id
    }));
  }, [searchQuery, jobs]);

  const allResults = useMemo(() => {
    return [...jobResults, ...filteredCommands];
  }, [jobResults, filteredCommands]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % allResults.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + allResults.length) % allResults.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const selectedCommand = allResults[selectedIndex];
          if (selectedCommand) {
            if (selectedCommand.path) {
              navigateToPath(selectedCommand.path);
            } else if ('action' in selectedCommand && selectedCommand.action) {
              selectedCommand.action();
            }
            setIsOpen(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allResults, navigateToPath]);

  useEffect(() => {
    setTimeout(() => setSelectedIndex(0), 0);
  }, [searchQuery]);

  const handleCommandClick = useCallback((command: CommandItem | JobSearchResult) => {
    if (command.path) {
      navigateToPath(command.path);
    } else if ('action' in command && command.action) {
      command.action();
    }
    setIsOpen(false);
    setSearchQuery('');
  }, [navigateToPath]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Command Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-blue-100">
            <Search className="h-5 w-5 text-blue-400" />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-black placeholder-black/40"
              autoFocus
            />
            <kbd className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded border border-blue-200">
              ESC
            </kbd>
          </div>

          {/* Command List */}
          <div className="max-h-96 overflow-y-auto">
            {allResults.length === 0 ? (
              <div className="px-4 py-8 text-center text-black/50">
                No commands found.
              </div>
            ) : (
              <div className="py-2">
                {jobResults.length > 0 && (
                  <div className="mb-4">
                    <div className="px-4 py-2 text-xs font-semibold text-black/40 uppercase tracking-wider">
                      Jobs
                    </div>
                    {jobResults.map((result) => {
                      const globalIndex = allResults.indexOf(result);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={result.id}
                          onClick={() => handleCommandClick(result)}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                            isSelected
                              ? 'bg-blue-50 text-blue-700'
                              : 'hover:bg-blue-50/50 text-black'
                          )}
                        >
                          <result.icon className="h-5 w-5" />
                          <div className="flex-1">
                            <div className="font-medium">{result.title}</div>
                            <div className="text-sm text-black/50">
                              {result.description}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="text-xs text-blue-600">
                              ↵
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                {['navigation', 'actions', 'settings'].map(category => {
                  const categoryCommands = filteredCommands.filter(cmd => cmd.category === category);
                  if (categoryCommands.length === 0) return null;

                  return (
                    <div key={category} className="mb-4">
                      <div className="px-4 py-2 text-xs font-semibold text-black/40 uppercase tracking-wider">
                        {category === 'navigation' && 'Navigation'}
                        {category === 'actions' && 'Actions'}
                        {category === 'settings' && 'Settings'}
                      </div>
                      {categoryCommands.map((command) => {
                        const globalIndex = allResults.indexOf(command);
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <button
                            key={command.id}
                            onClick={() => handleCommandClick(command)}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                              isSelected
                                ? 'bg-blue-50 text-blue-700'
                                : 'hover:bg-blue-50/50 text-black'
                            )}
                          >
                            <command.icon className="h-5 w-5" />
                            <div className="flex-1">
                              <div className="font-medium">{command.title}</div>
                              {command.description && (
                                <div className="text-sm text-black/50">
                                  {command.description}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <div className="text-xs text-blue-600">
                                ↵
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-blue-100 bg-blue-50/30">
            <div className="flex items-center gap-2 text-xs text-black/50">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-blue-200">
                ↑↓
              </kbd>
              <span>Navigate</span>
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-blue-200">
                ↵
              </kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-black/50">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-blue-200">
                ⌘K
              </kbd>
              <span>to open</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}