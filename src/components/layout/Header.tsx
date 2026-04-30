import { useState, useEffect } from 'react';
import { Search, Bell, Menu, Monitor, Sparkles, Settings, HelpCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useUIStore } from '../../store/modules/uiStore';
import { useAuthStore, useNotificationStore } from '../../features';
import { DevicePreview } from '../shared/DevicePreview';
import { NotificationCenter } from '../shared/NotificationCenter';
import { CommandPalette } from '../shared/CommandPalette';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useUIStore();
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [devicePreviewOpen, setDevicePreviewOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 w-full transition-all duration-500",
          "bg-white/95 backdrop-blur-md border-b border-border",
          scrolled
            ? "py-2 md:py-3 shadow-high-key"
            : "py-3 md:py-4 shadow-high-key/50"
        )}
      >
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Left Section: Logo & Search */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-blue-50 rounded-xl"
              onClick={onMobileMenuOpen}
            >
              <Menu className="h-5 w-5 text-black" />
            </Button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-high-key hover:shadow-glow-blue transition-shadow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-black hidden sm:block">
                ApplyFlow
              </span>
            </div>

            {/* Search Bar - Desktop */}
            <div className="group relative hidden lg:block flex-1 max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-4 w-4 text-black/40 transition-colors group-focus-within:text-blue-500" />
              </div>
              <Input
                placeholder="Search applications, companies, or commands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={() => {
                  // Trigger command palette on click
                  const event = new KeyboardEvent('keydown', { metaKey: true, key: 'k' });
                  window.dispatchEvent(event);
                }}
                className={cn(
                  "h-11 w-full pl-11 pr-12 rounded-2xl border-border bg-black/4 transition-all duration-200",
                  "focus:bg-white focus:border-blue-500 focus:shadow-glow-blue hover:bg-white/50 cursor-pointer"
                )}
              />
              <kbd className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xs text-black/40 font-mono bg-black/4 px-2 py-1 rounded">⌘K</span>
              </kbd>
            </div>
          </div>

          {/* Right Section: Actions & Profile */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            {/* Device Preview Button */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-500 hover:text-white border border-blue-200 transition-all duration-200 shadow-high-key hover:shadow-glow-blue"
              onClick={() => setDevicePreviewOpen(!devicePreviewOpen)}
            >
              <Monitor className="h-4 w-4 text-blue-600 group-hover:text-white" />
              <span className="text-sm font-semibold text-blue-600 group-hover:text-white">Preview</span>
            </Button>

            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-blue-50 rounded-xl"
              onClick={() => {
                const event = new KeyboardEvent('keydown', { metaKey: true, key: 'k' });
                window.dispatchEvent(event);
              }}
            >
              <Search className="h-5 w-5 text-black" />
            </Button>

            {/* Help - Hidden on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex hover:bg-blue-50 rounded-xl"
              onClick={() => navigate('/app/help')}
            >
              <HelpCircle className="h-5 w-5 text-black" />
            </Button>

            {/* Settings - Hidden on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex hover:bg-blue-50 rounded-xl"
              onClick={() => navigate('/app/settings')}
            >
              <Settings className="h-5 w-5 text-black" />
            </Button>

            {/* Notifications */}
            <button
              onClick={() => navigate('/app/notifications')}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-blue-50 flex items-center justify-center transition-colors"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-high-key">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Avatar - Simplified on mobile */}
            <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-border">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-semibold text-black">{user?.name || 'User'}</div>
                <div className="text-xs text-black/60">Premium Plan</div>
              </div>
              <Avatar
                initials={user?.name?.substring(0, 2).toUpperCase() || 'U'}
                size="sm"
                className="ring-2 ring-blue-100 hover:ring-blue-500 transition-all shadow-high-key"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Device Preview Modal */}
      <DevicePreview
        isOpen={devicePreviewOpen}
        onClose={() => setDevicePreviewOpen(false)}
      >
        <div className="min-h-screen bg-gradient-to-br from-white via-white to-black/2">
          {/* Dashboard Preview Content */}
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-black">Dashboard</h1>
                <p className="text-black/60">Your job search overview</p>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-black/4"></div>
                <div className="w-8 h-8 rounded-lg bg-black/4"></div>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-border shadow-high-key hover:shadow-high-key-hover transition-shadow">
                <div className="text-2xl font-bold text-black">12</div>
                <div className="text-sm text-black/60">Total Applications</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-border shadow-high-key hover:shadow-high-key-hover transition-shadow">
                <div className="text-2xl font-bold text-black">4</div>
                <div className="text-sm text-black/60">Interviews</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-border shadow-high-key hover:shadow-high-key-hover transition-shadow">
                <div className="text-2xl font-bold text-black">2</div>
                <div className="text-sm text-black/60">Offers</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-border shadow-high-key hover:shadow-high-key-hover transition-shadow">
                <div className="text-2xl font-bold text-black">33%</div>
                <div className="text-sm text-black/60">Success Rate</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-4 rounded-xl bg-white border border-border shadow-high-key">
              <h3 className="font-semibold text-black mb-3">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-black/2">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                  <span className="text-sm text-black/80">Applied to Senior Developer at Google</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-black/2">
                  <div className="w-2 h-2 rounded-full bg-black/60"></div>
                  <span className="text-sm text-black/80">Interview scheduled at Meta</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-black/2">
                  <div className="w-2 h-2 rounded-full bg-black/40"></div>
                  <span className="text-sm text-black/80">Updated resume profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DevicePreview>

      {notificationOpen && (
        <NotificationCenter open={notificationOpen} onClose={() => setNotificationOpen(false)} />
      )}

      <CommandPalette />
    </>
  );
}