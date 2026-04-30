import { useMemo } from 'react';
import { Building2, MapPin, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useJobStore } from '../features';
import { EmptyState } from '../components/shared/EmptyState';

export default function Companies() {
  const { jobs } = useJobStore();

  const companies = useMemo(() => {
    const companyMap = jobs.reduce((acc, job) => {
      if (!acc[job.company]) {
        acc[job.company] = {
          name: job.company,
          jobs: [],
          locations: new Set(),
          statuses: new Set(),
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

    return Object.values(companyMap).map((company) => ({
      name: company.name,
      jobCount: company.jobs.length,
      locations: Array.from(company.locations),
      statuses: Array.from(company.statuses),
      latestJob: company.jobs.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0],
    })).sort((a, b) => b.jobCount - a.jobCount);
  }, [jobs]);

  if (companies.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No companies yet"
        description="Add job applications to see companies you've applied to."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-black">Companies</h1>
        <p className="text-black/70 mt-1">
          Track companies you've applied to
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {companies.map((company) => (
          <Card key={company.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-black">
                <div className="h-10 w-10 rounded-xl bg-black/4 flex items-center justify-center shadow-high-key">
                  <Building2 className="h-5 w-5 text-black" />
                </div>
                {company.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-black/70">
                <Briefcase className="h-4 w-4" />
                <span className="font-semibold">{company.jobCount}</span>
                <span>{company.jobCount === 1 ? 'job' : 'jobs'}</span>
              </div>

              {company.locations.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-black/70">
                  <MapPin className="h-4 w-4" />
                  {company.locations.join(', ')}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {company.statuses.map((status) => (
                  <Badge
                    key={status}
                    variant={
                      status === 'offer'
                        ? 'success'
                        : status === 'interview'
                          ? 'info'
                          : status === 'rejected'
                            ? 'error'
                            : 'default'
                    }
                    className="text-xs"
                  >
                    {status}
                  </Badge>
                ))}
              </div>

              {company.latestJob && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-black/50 mb-1">Latest:</p>
                  <p className="text-sm font-semibold text-black truncate">{company.latestJob.title}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
