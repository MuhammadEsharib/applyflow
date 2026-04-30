import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { AuthGuard } from '../../components/shared/AuthGuard';

const LandingPage = lazy(() => import('../../pages/LandingPage.tsx'));
const Onboarding = lazy(() => import('../../pages/Onboarding.tsx'));
const AdminLogin = lazy(() => import('../../pages/AdminLogin.tsx'));
const Dashboard = lazy(() => import('../../pages/Dashboard.tsx'));
const Applications = lazy(() => import('../../pages/Applications.tsx'));
const Archived = lazy(() => import('../../pages/Archived.tsx'));
const Analytics = lazy(() => import('../../pages/Analytics.tsx'));
const Companies = lazy(() => import('../../pages/Companies.tsx'));
const Activity = lazy(() => import('../../pages/Activity.tsx'));
const Settings = lazy(() => import('../../pages/Settings.tsx'));
const Admin = lazy(() => import('../../pages/Admin.tsx'));
const Help = lazy(() => import('../../pages/Help.tsx'));
const Documentation = lazy(() => import('../../pages/Documentation.tsx'));
const DocumentationDetail = lazy(() => import('../../pages/DocumentationDetail.tsx'));
const Community = lazy(() => import('../../pages/Community.tsx'));
const LiveChat = lazy(() => import('../../pages/LiveChat.tsx'));
const ResumeTemplates = lazy(() => import('../../pages/ResumeTemplates.tsx'));
const InterviewTips = lazy(() => import('../../pages/InterviewTips.tsx'));
const CareerBlog = lazy(() => import('../../pages/CareerBlog.tsx'));
const Notifications = lazy(() => import('../../pages/Notifications.tsx'));
const NotFound = lazy(() => import('../../pages/NotFound.tsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <Onboarding />
      </Suspense>
    ),
  },
  {
    path: '/admin-login',
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <AdminLogin />
      </Suspense>
    ),
  },
  {
    path: '/app',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'applications',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Applications />
          </Suspense>
        ),
      },
      {
        path: 'archived',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Archived />
          </Suspense>
        ),
      },
      {
        path: 'analytics',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Analytics />
          </Suspense>
        ),
      },
      {
        path: 'companies',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Companies />
          </Suspense>
        ),
      },
      {
        path: 'activity',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Activity />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: 'help',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Help />
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Admin />
          </Suspense>
        ),
      },
      {
        path: 'documentation',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Documentation />
          </Suspense>
        ),
      },
      {
        path: 'documentation/:articleId',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <DocumentationDetail />
          </Suspense>
        ),
      },
      {
        path: 'community',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Community />
          </Suspense>
        ),
      },
      {
        path: 'livechat',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <LiveChat />
          </Suspense>
        ),
      },
      {
        path: 'resume-templates',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <ResumeTemplates />
          </Suspense>
        ),
      },
      {
        path: 'interview-tips',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <InterviewTips />
          </Suspense>
        ),
      },
      {
        path: 'career-blog',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <CareerBlog />
          </Suspense>
        ),
      },
      {
        path: 'notifications',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Notifications />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-4 p-4">
        <div className="h-8 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-4 w-5/6 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-32 w-full rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
    </div>
  );
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}
