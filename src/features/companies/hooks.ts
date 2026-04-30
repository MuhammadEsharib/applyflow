import { useMemo } from 'react';
import { useJobStore } from '../jobs';

export function useCompanies() {
  const { jobs } = useJobStore();

  const companies = useMemo(() => {
    const companyMap = jobs.reduce((acc, job) => {
      if (!acc[job.company]) {
        acc[job.company] = {
          name: job.company,
          jobs: [] as typeof jobs,
          locations: new Set<string>(),
          statuses: new Set<string>(),
        };
      }
      acc[job.company].jobs.push(job);
      if (job.location) acc[job.company].locations.add(job.location);
      acc[job.company].statuses.add(job.status);
      return acc;
    }, {} as Record<string, {
      name: string;
      jobs: typeof jobs;
      locations: Set<string>;
      statuses: Set<string>;
    }>);

    return Object.values(companyMap)
      .map((company) => ({
        name: company.name,
        jobCount: company.jobs.length,
        locations: Array.from(company.locations),
        statuses: Array.from(company.statuses),
        latestJob: company.jobs.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0],
      }))
      .sort((a, b) => b.jobCount - a.jobCount);
  }, [jobs]);

  return { companies };
}
