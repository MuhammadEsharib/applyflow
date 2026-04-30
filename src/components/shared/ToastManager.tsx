import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, useToast } from './Toast';
import { NotificationCenter } from './NotificationCenter';

export function ToastManager() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);

  // Listen for custom events from application actions
  useEffect(() => {
    const handleApplicationEvent = (event: CustomEvent) => {
      const { type, title, message } = event.detail;

      // Show toast first
      addToast({
        type,
        title,
        message,
        duration: 5000
      });

      // Then add to notification center after a short delay
      setTimeout(() => {
        const notificationEvent = new CustomEvent('addNotification', {
          detail: {
            id: `notif-${Date.now()}`,
            type,
            title,
            message,
            timestamp: new Date(),
            read: false
          }
        });
        window.dispatchEvent(notificationEvent);
      }, 1000);
    };

    window.addEventListener('applicationEvent', handleApplicationEvent as EventListener);
    window.addEventListener('userActionEvent', handleApplicationEvent as EventListener);

    return () => {
      window.removeEventListener('applicationEvent', handleApplicationEvent as EventListener);
      window.removeEventListener('userActionEvent', handleApplicationEvent as EventListener);
    };
  }, [addToast]);

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <NotificationCenter
        open={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
        onNavigateToApplication={(applicationId) => navigate(`/app/applications/${applicationId}`)}
        onViewAllNotifications={() => navigate('/app/notifications')}
      />
    </>
  );
}