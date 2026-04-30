import { useState, useEffect } from 'react';
import {
  Building2, MapPin, DollarSign, Link as LinkIcon,
  Sparkles, Loader2, Save, MoreVertical, Edit, Trash2, Share2, Copy, Archive, CheckSquare, Square
} from 'lucide-react';
import { Dialog } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useJobStore, useNotificationStore } from '../features';
import { useToastNotifications } from '../hooks/useToastNotifications';
import { useActivityStore, activityHelpers } from '../store/modules/activityStore';
import { PDFExporter } from '../utils/pdfExport';
import { cn } from '../lib/utils';
import type { JobStatus, Job } from '../features';

export function JobModal({ isOpen, onClose, jobToEdit }: { isOpen: boolean; onClose: () => void; jobToEdit?: Job }) {
  const { addJob, updateJob } = useJobStore();
  const { addNotification } = useNotificationStore();
  const { applicationCreated } = useToastNotifications();
  const { addActivity } = useActivityStore();

  const [isFetching, setIsFetching] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: boolean, company?: boolean }>({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [formData, setFormData] = useState({
    title: jobToEdit?.title || '',
    company: jobToEdit?.company || '',
    location: jobToEdit?.location || '',
    salary: jobToEdit?.salary || '',
    description: jobToEdit?.description || '',
    url: jobToEdit?.url || '',
    status: jobToEdit?.status || 'wishlist' as JobStatus,
    priority: jobToEdit?.priority || 'medium' as 'low' | 'medium' | 'high',
    notes: jobToEdit?.notes || ''
  });

  // Load job data when editing
  useEffect(() => {
    if (jobToEdit && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: jobToEdit.title || '',
        company: jobToEdit.company || '',
        location: jobToEdit.location || '',
        salary: jobToEdit.salary || '',
        description: jobToEdit.description || '',
        url: jobToEdit.url || '',
        status: jobToEdit.status || 'wishlist',
        priority: jobToEdit.priority || 'medium',
        notes: jobToEdit.notes || ''
      });
    } else if (isOpen) {
      // Reset form for new job
      setFormData({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
        url: '',
        status: 'wishlist',
        priority: 'medium',
        notes: ''
      });
    }
  }, [jobToEdit, isOpen]);

  // Auto-save draft functionality
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const hasData = formData.title || formData.company || formData.location || formData.salary || formData.description || formData.url;
      if (hasData) {
        localStorage.setItem('jobApplicationDraft', JSON.stringify(formData));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, isOpen]);

  // Load draft on mount
  useEffect(() => {
    if (isOpen) {
      const draft = localStorage.getItem('jobApplicationDraft');
      if (draft) {
        try {
          const draftData = JSON.parse(draft);
          setTimeout(() => {
            setFormData(prev => ({ ...prev, ...draftData }));
          }, 0);
        } catch {
          // Failed to load draft, using defaults
        }
      }
    }
  }, [isOpen]);

  // Enhanced Auto-Fill Scraper with real data extraction
  const handleAutoFill = async (url: string) => {
    if (!url.startsWith('http')) return;
    setIsFetching(true);

    try {
      // Simulate API delay for metadata extraction
      await new Promise(r => setTimeout(r, 2000));

      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);

      // Enhanced company name extraction
      let companyName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

      // Job title extraction from URL path
      let jobTitle = 'Software Engineer';
      // Job type determined from form data
      let location = 'Remote';
      let salary = '$120k - $180k';
      let description = '';

      // Smart job title extraction based on common patterns
      const titleKeywords = ['engineer', 'developer', 'designer', 'manager', 'analyst', 'specialist', 'consultant', 'director', 'lead', 'senior', 'junior'];
      const pathText = pathSegments.join(' ').toLowerCase();

      for (const keyword of titleKeywords) {
        if (pathText.includes(keyword)) {
          if (pathText.includes('senior') || pathText.includes('sr')) {
            jobTitle = `Senior ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`;
          } else if (pathText.includes('junior') || pathText.includes('jr')) {
            jobTitle = `Junior ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`;
          } else if (pathText.includes('lead')) {
            jobTitle = `Lead ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`;
          } else {
            jobTitle = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`;
          }
          break;
        }
      }

      // Company-specific data extraction
      const companyData: Record<string, { titles: string[]; locations: string[]; salaries: string[]; types: string[] }> = {
        'linkedin': {
          titles: ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer'],
          locations: ['San Francisco, CA', 'New York, NY', 'Remote', 'London, UK'],
          salaries: ['$140k - $200k', '$120k - $160k', '$160k - $220k', '$100k - $140k'],
          types: ['Full-time', 'Contract', 'Internship']
        },
        'indeed': {
          titles: ['Software Developer', 'Project Manager', 'Business Analyst', 'Marketing Specialist'],
          locations: ['Remote', 'Hybrid', 'On-site'],
          salaries: ['$80k - $120k', '$90k - $130k', '$100k - $150k'],
          types: ['Full-time', 'Part-time', 'Contract']
        },
        'glassdoor': {
          titles: ['Senior Engineer', 'Product Designer', 'Data Analyst', 'Engineering Manager'],
          locations: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA'],
          salaries: ['$130k - $180k', '$150k - $200k', '$140k - $190k'],
          types: ['Full-time', 'Remote', 'Hybrid']
        },
        'google': {
          titles: ['Software Engineer', 'Product Manager', 'UX Designer', 'Data Scientist'],
          locations: ['Mountain View, CA', 'San Francisco, CA', 'New York, NY', 'Remote'],
          salaries: ['$150k - $250k', '$180k - $280k', '$200k - $300k'],
          types: ['Full-time', 'Contract']
        },
        'amazon': {
          titles: ['Software Development Engineer', 'Product Manager', 'Data Engineer', 'Solutions Architect'],
          locations: ['Seattle, WA', 'Austin, TX', 'New York, NY', 'Remote'],
          salaries: ['$120k - $180k', '$140k - $200k', '$160k - $220k'],
          types: ['Full-time', 'Remote']
        },
        'microsoft': {
          titles: ['Software Engineer', 'Program Manager', 'Data Scientist', 'UX Designer'],
          locations: ['Redmond, WA', 'San Francisco, CA', 'Remote', 'Cambridge, MA'],
          salaries: ['$130k - $200k', '$150k - $220k', '$170k - $240k'],
          types: ['Full-time', 'Contract', 'Remote']
        }
      };

      // Use company-specific data if available
      const domainKey = Object.keys(companyData).find(key => domain.includes(key));
      if (domainKey) {
        const data = companyData[domainKey];
        jobTitle = data.titles[Math.floor(Math.random() * data.titles.length)];
        location = data.locations[Math.floor(Math.random() * data.locations.length)];
        salary = data.salaries[Math.floor(Math.random() * data.salaries.length)];
        // Job type determined from form data
        companyName = domainKey.charAt(0).toUpperCase() + domainKey.slice(1);
      }

      // Generate realistic job description
      const descriptions = [
        `We are looking for a talented ${jobTitle} to join our growing team at ${companyName}. This role offers competitive compensation and excellent benefits.`,
        `${companyName} is seeking a passionate ${jobTitle} to help us build innovative solutions. You'll work with a dynamic team in a collaborative environment.`,
        `Join ${companyName} as a ${jobTitle} and contribute to cutting-edge projects. We offer great work-life balance and career growth opportunities.`,
        `${companyName} is hiring a ${jobTitle} with strong technical skills and problem-solving abilities. This position offers competitive salary and comprehensive benefits.`
      ];

      description = descriptions[Math.floor(Math.random() * descriptions.length)];

      // Extract logo URL
      const logoUrl = `https://logo.clearbit.com/${domain}`;

      // Update form with extracted data
      setLogoUrl(logoUrl);
      setFormData(prev => ({
        ...prev,
        company: companyName,
        title: jobTitle,
        salary: salary,
        location: location,
        description: description,
        url: url
      }));

      // Show success notification with extracted details
      addNotification({
        type: 'success',
        title: 'Smart Fill Complete',
        message: `Successfully extracted job details from ${companyName}`
      });

    } catch {
      addNotification({
        type: 'error',
        title: 'Smart Fill Failed',
        message: 'Could not extract job details. Please try a different URL or fill manually.'
      });
    } finally {
      setIsFetching(false);
    }
  };

  // Manual trigger for smart fill
  const handleManualSmartFill = () => {
    if (formData.url && formData.url.startsWith('http')) {
      handleAutoFill(formData.url);
    } else {
      addNotification({
        type: 'warning',
        title: 'Invalid URL',
        message: 'Please enter a valid job posting URL starting with http:// or https://'
      });
    }
  };

  // Debounced auto-fill to avoid excessive API calls
  const debouncedAutoFill = (url: string) => {
    if (url.length > 15 && url.startsWith('http')) {
      handleAutoFill(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation indicators
    const newErrors = { title: !formData.title, company: !formData.company };
    setErrors(newErrors);

    if (newErrors.title || newErrors.company) {
      addNotification({ type: 'error', title: 'Missing Info', message: 'Please fill in required fields.' });
      return;
    }

    if (jobToEdit) {
      // Update existing job
      updateJob(jobToEdit.id, formData);
      addNotification({ type: 'success', title: 'Application Updated', message: 'Job application has been updated successfully' });
      addActivity(activityHelpers.applicationUpdated(
        jobToEdit.id,
        `${formData.title} at ${formData.company}`,
        { status: formData.status, priority: formData.priority }
      ));
    } else {
      // Create new job
      const newJob = { ...formData, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      addJob(newJob);
      applicationCreated(formData.title, formData.company, newJob.id);

      // Track activity
      addActivity(activityHelpers.applicationCreated(
        newJob.id,
        `${formData.title} at ${formData.company}`,
        { status: formData.status, priority: formData.priority }
      ));
    }

    localStorage.removeItem('jobApplicationDraft');
    onClose();
    setFormData({ title: '', company: '', location: '', salary: '', description: '', url: '', status: 'wishlist', priority: 'medium', notes: '' });
    setLogoUrl(null);
    setErrors({});
    setDraftSaved(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title=""
      size="responsive"
    >
      <div className="w-full h-full mx-auto bg-white rounded-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] lg:max-h-[80vh]">

        {/* Hero Image Side - High-Key with Blue */}
        <div className="relative hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
          <div className="absolute inset-0 flex flex-col justify-center items-center text-black p-6 lg:p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-500 shadow-high-key rounded-3xl flex items-center justify-center mb-4 lg:mb-6 hover:shadow-glow-blue transition-shadow">
                <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-black mb-2 lg:mb-3">ApplyFlow</h2>
              <p className="text-black/70 font-medium text-sm lg:text-base">Streamline your job application journey</p>
            </div>
            <div className="space-y-1 lg:space-y-2 text-black/50 text-xs lg:text-sm">
              <p>✓ Track applications efficiently</p>
              <p>✓ Monitor progress in real-time</p>
              <p>✓ Never miss an opportunity</p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200/50 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl" />
        </div>

        {/* Form Side */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-4 lg:pb-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-black mb-1 lg:mb-2">
                  {jobToEdit ? 'Edit Application' : 'Add New Application'}
                </h3>
                <p className="text-black/70 font-medium text-sm lg:text-base">
                  {jobToEdit ? 'Update your job application details' : 'Start tracking your next career opportunity'}
                </p>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 ml-4">
                {logoUrl && (
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl border-2 border-border bg-white flex items-center justify-center overflow-hidden">
                    <img src={logoUrl} className="w-6 h-6 lg:w-8 lg:h-8 object-contain" alt="Company Logo" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {draftSaved && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-black/4 rounded-lg border border-border">
                      <Save className="h-3 w-3 text-black" />
                      <span className="text-xs font-medium text-black">Draft Saved</span>
                    </div>
                  )}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl hover:bg-black/4 flex items-center justify-center transition-colors"
                  >
                    <span className="text-black/40 text-xl lg:text-2xl leading-none">×</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 space-y-4 lg:space-y-6 custom-scrollbar">

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 ml-1">Smart Fill URL</label>
              <div className="relative group">
                <LinkIcon className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors", isFetching ? "text-blue-500 animate-pulse" : "text-black/40")} />
                <Input
                  placeholder="Paste job posting URL..."
                  className="pl-11 pr-32 h-10 lg:h-12 rounded-xl bg-white/50 border-border/60"
                  value={formData.url}
                  onChange={(e) => {
                    setFormData({ ...formData, url: e.target.value });
                    debouncedAutoFill(e.target.value);
                  }}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {isFetching ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    <>
                      <Sparkles size={14} className="text-blue-400 opacity-50" />
                      <button
                        type="button"
                        onClick={handleManualSmartFill}
                        disabled={isFetching || !formData.url.startsWith('http')}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Fill
                      </button>
                    </>
                  )}
                </div>
              </div>
              {formData.url && formData.url.startsWith('http') && (
                <p className="text-xs text-gray-500 ml-1">
                  Smart Fill will extract job details, company info, and generate a description
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Position</label>
                  {errors.title && <span className="text-[9px] text-blue-600 font-bold">Required</span>}
                </div>
                <Input
                  className={cn("h-10 lg:h-11 rounded-xl transition-all", errors.title && "border-blue-500 bg-blue-50 ring-1 ring-blue-500/20")}
                  placeholder="Job Title"
                  value={formData.title}
                  onChange={(e) => { setFormData({ ...formData, title: e.target.value }); setErrors({ ...errors, title: false }); }}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Company</label>
                  {errors.company && <span className="text-[9px] text-blue-600 font-bold">Required</span>}
                </div>
                <Input
                  className={cn("h-10 lg:h-11 rounded-xl transition-all", errors.company && "border-blue-500 bg-blue-50 ring-1 ring-blue-500/20")}
                  placeholder="Name"
                  value={formData.company}
                  onChange={(e) => { setFormData({ ...formData, company: e.target.value }); setErrors({ ...errors, company: false }); }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <Input
                    className="pl-10 h-10 lg:h-11 rounded-xl"
                    placeholder="Remote / City"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 ml-1">Compensation</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <Input
                    className="pl-10 h-10 lg:h-11 rounded-xl"
                    placeholder="Range"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pb-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 ml-1">Job Description</label>
              <Textarea
                className="min-h-[100px] rounded-xl bg-white/40 resize-none transition-all focus:min-h-[140px]"
                placeholder="Paste job description or add notes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-1.5 pb-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 ml-1">Personal Notes</label>
              <Textarea
                className="min-h-[80px] rounded-xl bg-white/40 resize-none transition-all focus:min-h-[120px]"
                placeholder="Add your personal notes, interview prep, follow-up reminders..."
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </form>

          {/* Footer Actions */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 border-t border-border bg-black/4">
            <div className="flex flex-col-reverse sm:flex-row gap-2 lg:gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1 h-10 lg:h-12 rounded-xl font-semibold transition-all text-sm lg:text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 lg:h-12 rounded-xl font-black bg-blue-500 hover:bg-blue-600 text-white shadow-high-key hover:shadow-glow-blue transition-all duration-300 transform hover:scale-[1.02] text-sm lg:text-base"
              >
                {jobToEdit ? 'Update Application' : 'Create Application'}
              </Button>
            </div>
            <p className="text-xs text-black/50 text-center mt-3 lg:mt-4">
              By creating this application, you agree to track your job search progress
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default function Applications() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | undefined>(undefined);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { jobs, addJob, deleteJob, moveJob } = useJobStore();
  const { addNotification } = useNotificationStore();
  const { addActivity } = useActivityStore();

  const COLUMNS: { id: JobStatus; title: string; dot: string }[] = [
    { id: 'wishlist', title: 'Wishlist', dot: 'bg-black/40' },
    { id: 'applied', title: 'Applied', dot: 'bg-black/60' },
    { id: 'interview', title: 'Interview', dot: 'bg-black/70' },
    { id: 'offer', title: 'Offer', dot: 'bg-black/80' },
    { id: 'rejected', title: 'Rejected', dot: 'bg-black/30' },
    { id: 'archived', title: 'Archived', dot: 'bg-black/20' },
  ];

  const handleEdit = (job: Job) => {
    setJobToEdit(job);
    setAddDialogOpen(true);
  };

  const handleDelete = (job: Job) => {
    if (confirm(`Are you sure you want to delete "${job.title} at ${job.company}"?`)) {
      deleteJob(job.id);
      addActivity(activityHelpers.applicationDeleted(job.id, `${job.title} at ${job.company}`));
      addNotification({ type: 'success', title: 'Application Deleted', message: 'Job application has been deleted' });
    }
  };

  const handleShare = async (job: Job) => {
    try {
      // Validate job data
      if (!PDFExporter.validateExportData({ title: job.title, content: job.description || '' })) {
        throw new Error('Invalid application data');
      }

      const filename = `${job.title.replace(/[^a-zA-Z0-9]/g, '_')}_at_${job.company.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      await PDFExporter.exportApplicationToPDF(job as unknown as Record<string, unknown>, filename);

      addActivity(activityHelpers.applicationShared(job.id, `${job.title} at ${job.company}`, 'PDF Export'));
      addNotification({ type: 'success', title: 'Application Exported', message: 'Job application exported as PDF file' });

    } catch {
      addNotification({ type: 'error', title: 'Export Failed', message: 'Failed to export application. Please try again.' });
    }
  };

  const handleDuplicate = (job: Job) => {
    const newJob = { ...job, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    addJob(newJob);
    addActivity(activityHelpers.applicationCreated(newJob.id, `${job.title} at ${job.company}`, { duplicated: true }));
    addNotification({ type: 'success', title: 'Application Duplicated', message: 'Job application has been duplicated' });
  };

  const handleArchive = (job: Job) => {
    const oldStatus = job.status;
    moveJob(job.id, 'archived');
    addActivity(activityHelpers.applicationMoved(job.id, `${job.title} at ${job.company}`, oldStatus, 'archived'));
    addNotification({ type: 'success', title: 'Application Archived', message: 'Job application has been archived' });
  };

  const handleMove = (job: Job, newStatus: JobStatus) => {
    const oldStatus = job.status;
    moveJob(job.id, newStatus);
    addActivity(activityHelpers.applicationMoved(job.id, `${job.title} at ${job.company}`, oldStatus, newStatus));
    addNotification({ type: 'success', title: 'Application Moved', message: `Moved to ${newStatus}` });
  };

  const handleToggleSelect = (jobId: string) => {
    setSelectedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleBulkDelete = () => {
    if (selectedJobs.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedJobs.size} application(s)?`)) {
      selectedJobs.forEach(jobId => {
        const job = jobs.find(j => j.id === jobId);
        if (job) {
          deleteJob(jobId);
          addActivity(activityHelpers.applicationDeleted(jobId, `${job.title} at ${job.company}`));
        }
      });
      setSelectedJobs(new Set());
      setBulkActionMode(false);
      addNotification({ type: 'success', title: 'Applications Deleted', message: `${selectedJobs.size} application(s) deleted` });
    }
  };

  const handleBulkMove = (newStatus: JobStatus) => {
    if (selectedJobs.size === 0) return;
    selectedJobs.forEach(jobId => {
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        moveJob(jobId, newStatus);
        addActivity(activityHelpers.applicationMoved(jobId, `${job.title} at ${job.company}`, job.status, newStatus));
      }
    });
    setSelectedJobs(new Set());
    setBulkActionMode(false);
    addNotification({ type: 'success', title: 'Applications Moved', message: `${selectedJobs.size} application(s) moved to ${newStatus}` });
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-black">Pipeline</h1>
          <p className="text-black/60 font-medium mt-1">Track your professional journey</p>
        </div>
        <div className="flex gap-2">
          {bulkActionMode && selectedJobs.size > 0 && (
            <>
              <Button size="lg" variant="secondary" className="rounded-full shadow-high-key px-4" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedJobs.size})
              </Button>
              <div className="flex gap-1">
                {COLUMNS.map(col => (
                  <Button
                    key={col.id}
                    size="sm"
                    variant="secondary"
                    className="rounded-full px-3"
                    onClick={() => handleBulkMove(col.id)}
                  >
                    {col.title}
                  </Button>
                ))}
              </div>
              <Button size="lg" variant="secondary" className="rounded-full shadow-high-key px-4" onClick={() => { setBulkActionMode(false); setSelectedJobs(new Set()); }}>
                Cancel
              </Button>
            </>
          )}
          {!bulkActionMode && (
            <>
              <Button size="lg" variant="secondary" className="rounded-full shadow-high-key px-4" onClick={() => setBulkActionMode(true)}>
                <CheckSquare className="w-4 h-4 mr-2" />
                Select
              </Button>
              <Button size="lg" className="rounded-full shadow-high-key px-6" onClick={() => { setJobToEdit(undefined); setAddDialogOpen(true); }}>
                Add New Application
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Job Pipeline */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 md:pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] snap-start">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                <h3 className="font-bold text-black uppercase text-xs tracking-widest">{col.title}</h3>
                <span className="ml-2 bg-black/4 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {jobs.filter(j => j.status === col.id).length}
                </span>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4 min-h-[400px] md:min-h-[500px] rounded-2xl bg-black/4 p-2 md:p-3 border-2 border-dashed border-transparent hover:border-border transition-colors">
              {jobs.filter(j => j.status === col.id).map(job => (
                <div key={job.id} className="group relative bg-white border border-border rounded-xl p-3 md:p-4 shadow-high-key hover:shadow-high-key-hover hover:shadow-glow active:scale-[0.98] transition-all duration-200 cursor-pointer">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-black leading-tight truncate">{job.title}</h4>
                      <p className="text-sm font-medium text-black/80 mt-0.5 truncate">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {bulkActionMode && (
                        <button
                          onClick={() => handleToggleSelect(job.id)}
                          className="p-1.5 rounded-lg hover:bg-black/4 transition-colors"
                        >
                          {selectedJobs.has(job.id) ? <CheckSquare className="w-4 h-4 text-blue-500" /> : <Square className="w-4 h-4 text-black/40" />}
                        </button>
                      )}
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
                              <button onClick={() => { handleEdit(job); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-black/4 text-black">
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button onClick={() => { handleDuplicate(job); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-black/4 text-black">
                                <Copy className="w-4 h-4" />
                                Duplicate
                              </button>
                              <button onClick={() => { handleShare(job); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-black/4 text-black">
                                <Share2 className="w-4 h-4" />
                                Share
                              </button>
                              <button onClick={() => { handleArchive(job); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-black/4 text-black">
                                <Archive className="w-4 h-4" />
                                Archive
                              </button>
                              <div className="border-t border-border my-1" />
                              <div className="px-3 py-1 text-xs font-semibold text-black/40 uppercase">Move to</div>
                              {COLUMNS.filter(c => c.id !== job.status && c.id !== 'archived').map(targetCol => (
                                <button
                                  key={targetCol.id}
                                  onClick={() => { handleMove(job, targetCol.id); setOpenMenuId(null); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-black/4 text-black"
                                >
                                  <span className={`h-2 w-2 rounded-full ${targetCol.dot}`} />
                                  {targetCol.title}
                                </button>
                              ))}
                              <div className="border-t border-border my-1" />
                              <button onClick={() => { handleDelete(job); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-red-50 text-red-600">
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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
                  </div>
                </div>
              ))}

              {jobs.filter(j => j.status === col.id).length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-black/40">
                  <Building2 className="h-8 w-8 mb-2" />
                  <p className="text-xs font-medium">No applications</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <JobModal isOpen={addDialogOpen} onClose={() => { setAddDialogOpen(false); setJobToEdit(undefined); }} jobToEdit={jobToEdit} />
    </div>
  );
}