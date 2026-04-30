import { useCallback } from 'react';
import { useToast } from '../components/shared/Toast';
import { useNotificationStore } from '../features';

export function useToastNotifications() {
  const { addToast } = useToast();
  const { addNotification, addApplicationNotification } = useNotificationStore();

  const notify = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    metadata?: Record<string, unknown>
  ) => {
    // Show toast
    addToast({ type, title, message, duration: 5000 });

    // Store in notification center
    addNotification({
      type: type as 'success' | 'error' | 'warning' | 'info',
      title,
      message: message || '',
      metadata
    });
  }, [addToast, addNotification]);

  const applicationCreated = useCallback((jobTitle: string, company: string, applicationId: string) => {
    notify('success', 'Application Created', `${jobTitle} at ${company} has been added to your pipeline.`, {
      applicationId,
      companyName: company,
      action: 'created'
    });

    // Also add specific application notification
    addApplicationNotification('created', company, applicationId);
  }, [notify, addApplicationNotification]);

  const applicationDeleted = useCallback((jobTitle: string, company: string, applicationId: string) => {
    notify('error', 'Application Deleted', `${jobTitle} at ${company} has been removed from your pipeline.`, {
      applicationId,
      companyName: company,
      action: 'deleted'
    });

    addApplicationNotification('deleted', company, applicationId);
  }, [notify, addApplicationNotification]);

  const applicationUpdated = useCallback((jobTitle: string, company: string, changes: string, applicationId: string) => {
    notify('info', 'Application Updated', `${jobTitle} at ${company}: ${changes}`, {
      applicationId,
      companyName: company,
      action: 'updated'
    });

    addApplicationNotification('updated', company, applicationId);
  }, [notify, addApplicationNotification]);

  const applicationArchived = useCallback((jobTitle: string, company: string, applicationId: string) => {
    notify('info', 'Application Archived', `${jobTitle} at ${company} has been archived.`, {
      applicationId,
      companyName: company,
      action: 'archived'
    });

    addApplicationNotification('archived', company, applicationId);
  }, [notify, addApplicationNotification]);

  const applicationMoved = useCallback((jobTitle: string, company: string, newStatus: string, applicationId: string) => {
    notify('info', 'Status Changed', `${jobTitle} at ${company} moved to ${newStatus}.`, {
      applicationId,
      companyName: company,
      action: 'moved'
    });

    addApplicationNotification('moved', company, applicationId);
  }, [notify, addApplicationNotification]);

  const interviewScheduled = useCallback((company: string, applicationId: string) => {
    notify('success', 'Interview Scheduled', `Your interview with ${company} has been scheduled.`, {
      applicationId,
      companyName: company
    });
  }, [notify]);

  const offerReceived = useCallback((company: string, applicationId: string) => {
    notify('success', 'Offer Received!', `Congratulations! You received an offer from ${company}.`, {
      applicationId,
      companyName: company
    });
  }, [notify]);

  const settingsChanged = useCallback((setting: string) => {
    notify('info', 'Settings Updated', `${setting} has been updated successfully.`);
  }, [notify]);

  const userAction = useCallback((action: string, details?: string) => {
    notify('info', 'Action Completed', `${action}${details ? `: ${details}` : ''}`);
  }, [notify]);

  return {
    notify,
    applicationCreated,
    applicationDeleted,
    applicationUpdated,
    applicationArchived,
    applicationMoved,
    interviewScheduled,
    offerReceived,
    settingsChanged,
    userAction
  };
}