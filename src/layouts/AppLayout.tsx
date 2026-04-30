import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { ToastManager } from '../components/shared/ToastManager';
import { pageTransition, pageTransitionConfig } from '../lib/motion';
import { useUIStore } from '../store/modules/uiStore';

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-white flex">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'} ml-0`}>
        <Header onMobileMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransitionConfig}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Toast Manager */}
      <ToastManager />
    </div>
  );
}
