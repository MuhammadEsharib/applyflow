import { useState } from 'react';
import { MapPin, DollarSign, Archive, Undo, Trash2, MoreVertical, Copy } from 'lucide-react';
import { useJobStore, useNotificationStore } from '../features';
import { useActivityStore, activityHelpers } from '../store/modules/activityStore';
import type { Job } from '../features';

export default function Archived() {
  const { jobs, deleteJob, moveJob } = useJobStore();
  const { addNotification } = useNotificationStore();
  const { addActivity } = useActivityStore();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const archivedJobs = jobs.filter(job => job.status === 'archived');

  const handleRestore = (job: Job, newStatus: 'wishlist' | 'applied' | 'interview' | 'offer') => {
    const oldStatus = job.status;
    moveJob(job.id, newStatus);
    addActivity(activityHelpers.applicationMoved(job.id, `${job.title} at ${job.company}`, oldStatus, newStatus));
    addNotification({ type: 'success', title: 'Application Restored', message: `Moved to ${newStatus}` });
    setOpenMenuId(null);
  };

  const handleDelete = (job: Job) => {
    if (confirm(`Are you sure you want to permanently delete "${job.title} at ${job.company}"?`)) {
      deleteJob(job.id);
      addActivity(activityHelpers.applicationDeleted(job.id, `${job.title} at ${job.company}`));
      addNotification({ type: 'success', title: 'Application Deleted', message: 'Job application has been permanently deleted' });
      setOpenMenuId(null);
    }
  };

  const handleDuplicate = (job: Job) => {
    const newJob = { ...job, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'wishlist' as const };
    moveJob(newJob.id, 'wishlist');
    addActivity(activityHelpers.applicationCreated(newJob.id, `${job.title} at ${job.company}`, { duplicated: true, restored: true }));
    addNotification({ type: 'success', title: 'Application Duplicated', message: 'Job application has been duplicated and added to wishlist' });
    setOpenMenuId(null);
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-black">Archived</h1>
          <p className="text-black/60 font-medium mt-1">Your archived job applications</p>
        </div>
        <div className="text-sm text-black/50">
          {archivedJobs.length} archived application{archivedJobs.length !== 1 ? 's' : ''}
        </div>
      </header>

      {archivedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-black/4 rounded-3xl flex items-center justify-center mb-6">
            <Archive className="w-10 h-10 text-black/40" />
          </div>
          <h3 className="text-xl font-bold text-black mb-2">No Archived Applications</h3>
          <p className="text-black/60 max-w-md">
            Applications you archive will appear here. Archive jobs you're no longer pursuing but want to keep for reference.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {archivedJobs.map(job => (
            <div key={job.id} className="group relative bg-white border border-border rounded-xl p-4 shadow-high-key hover:shadow-high-key-hover hover:shadow-glow active:scale-[0.98] transition-all duration-200">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-black leading-tight truncate">{job.title}</h4>
                  <p className="text-sm font-medium text-black/80 mt-0.5 truncate">{job.company}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                    className="p-1.5 rounded-lg hover:bg-black/4 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-black/60" />
                  </button>
                  {openMenuId === job.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-xl shadow-xl z-10">
                      <div className="p-1">
                        <div className="px-3 py-1 text-xs font-semibold text-black/40 uppercase">Restore to</div>
                        {['wishlist', 'applied', 'interview', 'offer'].map(status => (
                          <button
                            key={status}
                            onClick={() => handleRestore(job, status as 'wishlist' | 'applied' | 'interview' | 'offer')}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-black/4 text-black capitalize"
                          >
                            <Undo className="w-4 h-4" />
                            {status}
                          </button>
                        ))}
                        <div className="border-t border-border my-1" />
                        <button onClick={() => handleDuplicate(job)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-black/4 text-black">
                          <Copy className="w-4 h-4" />
                          Duplicate & Restore
                        </button>
                        <div className="border-t border-border my-1" />
                        <button onClick={() => handleDelete(job)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-red-50 text-red-600">
                          <Trash2 className="w-4 h-4" />
                          Delete Permanently
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                {job.location && (
                  <div className="flex items-center gap-1.5 text-xs text-black/60">
                    <MapPin className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{job.location}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center gap-1.5 text-xs text-black/60">
                    <DollarSign className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{job.salary}</span>
                  </div>
                )}
                {job.notes && (
                  <div className="text-xs text-black/50 italic mt-2 line-clamp-2">
                    "{job.notes}"
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-lg bg-black/4 text-black font-bold">
                  {job.priority}
                </div>
                <div className="text-[10px] text-black/40">
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
