import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Building2,
  Activity,
  Settings,
  LogOut,
  Shield,
  Archive,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/modules/uiStore';
import { useAuthStore } from '../../features';
import { LogoutModal } from '../shared/LogoutModal';
import { useState } from 'react';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/applications', icon: Briefcase, label: 'Applications' },
  { to: '/app/archived', icon: Archive, label: 'Archived' },
  { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/app/companies', icon: Building2, label: 'Companies' },
  { to: '/app/activity', icon: Activity, label: 'Activity' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];

interface SidebarContentProps {
  isMobile?: boolean;
  onMobileClose?: () => void;
}

function SidebarContent({ isMobile = false, onMobileClose }: SidebarContentProps) {
  const { sidebarOpen } = useUIStore();
  const { logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setLogoutModalOpen(false);
  };

  const adminNavItems = [
    { to: '/app/admin', icon: Shield, label: 'Admin Panel' },
  ];

  return (
    <div className={`flex h-full flex-col bg-white border-r border-border transition-all duration-300 ${sidebarOpen || isMobile ? 'w-64' : 'w-16'}`}>
      {/* Header / Logo */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="w-8 h-8 bg-black/4 rounded-xl flex items-center justify-center shadow-high-key">
          <Briefcase className="w-5 h-5 text-black" />
        </div>
        <AnimatePresence mode="wait">
          {(sidebarOpen || isMobile) && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="whitespace-nowrap text-lg font-bold tracking-tight text-black"
            >
              ApplyFlow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={isMobile ? onMobileClose : undefined}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center h-11 rounded-xl transition-all duration-300',
                isActive
                  ? 'text-black bg-black/4'
                  : 'text-black/60 hover:bg-black/4'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex w-11 shrink-0 items-center justify-center">
                  <item.icon size={20} className={cn('transition-transform group-hover:scale-110', isActive && 'stroke-[2.5px]')} />
                </div>

                <AnimatePresence mode="wait">
                  {(sidebarOpen || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-semibold whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-black rounded-r-full" />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Admin Panel Link - Only for admins */}
        {isAdmin() && adminNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={isMobile ? onMobileClose : undefined}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center h-11 rounded-xl transition-all duration-300',
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-blue-500 hover:bg-blue-50'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex w-11 shrink-0 items-center justify-center">
                  <item.icon size={20} className={cn('transition-transform group-hover:scale-110', isActive && 'stroke-[2.5px]')} />
                </div>

                <AnimatePresence mode="wait">
                  {(sidebarOpen || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-semibold whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => setLogoutModalOpen(true)}
          className="flex h-11 w-full items-center rounded-xl text-black/60 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <div className="flex w-11 shrink-0 items-center justify-center">
            <LogOut size={20} />
          </div>
          <AnimatePresence>
            {(sidebarOpen || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-semibold"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar - Always Fixed */}
      <div className="hidden md:flex h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-md md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-60 h-full w-[280px] md:hidden shadow-2xl"
            >
              <SidebarContent isMobile onMobileClose={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}