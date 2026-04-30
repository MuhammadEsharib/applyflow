import { useMemo } from 'react';
import { useJobStore } from '../jobs';

export function useAnalytics() {
  const { jobs } = useJobStore();

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      wishlist: jobs.filter((j) => j.status === 'wishlist').length,
      applied: jobs.filter((j) => j.status === 'applied').length,
      interview: jobs.filter((j) => j.status === 'interview').length,
      offer: jobs.filter((j) => j.status === 'offer').length,
      rejected: jobs.filter((j) => j.status === 'rejected').length,
    };
  }, [jobs]);

  const statusData = useMemo(() => {
    return [
      { name: 'wishlist', value: stats.wishlist },
      { name: 'applied', value: stats.applied },
      { name: 'interview', value: stats.interview },
      { name: 'offer', value: stats.offer },
      { name: 'rejected', value: stats.rejected },
    ].filter((item) => item.value > 0);
  }, [stats]);

  const priorityData = useMemo(() => {
    return [
      { name: 'high', value: jobs.filter((j) => j.priority === 'high').length },
      { name: 'medium', value: jobs.filter((j) => j.priority === 'medium').length },
      { name: 'low', value: jobs.filter((j) => j.priority === 'low').length },
    ];
  }, [jobs]);

  const companyData = useMemo(() => {
    const companyCounts = jobs.reduce((acc, job) => {
      acc[job.company] = (acc[job.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(companyCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [jobs]);

  const conversionRate = useMemo(() => {
    if (jobs.length === 0) return 0;
    return ((stats.offer / jobs.length) * 100).toFixed(1);
  }, [jobs.length, stats.offer]);

  const interviewRate = useMemo(() => {
    if (jobs.length === 0) return 0;
    return ((stats.interview / jobs.length) * 100).toFixed(1);
  }, [jobs.length, stats.interview]);

  return {
    stats,
    statusData,
    priorityData,
    companyData,
    conversionRate,
    interviewRate,
  };
}
