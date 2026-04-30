import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PDFExporter } from '../utils/pdfExport';
import {
  BookOpen,
  ArrowLeft,
  Clock,
  Download,
  Share2,
  CheckCircle,
  Code,
  Lightbulb,
  Target,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Star,
  MessageCircle,
  ThumbsUp,
  Bookmark
} from 'lucide-react';

interface DocContent {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  readTime: string;
  sections: DocSection[];
  relatedArticles: string[];
}

interface DocSection {
  id: string;
  title: string;
  content: string[];
  codeSnippets?: { language: string; code: string; title?: string }[];
  tips?: string[];
  warnings?: string[];
  examples?: { title: string; description: string; code?: string }[];
}

const documentationContent: Record<string, DocContent> = {
  'quick-start': {
    id: 'quick-start',
    title: 'Quick Start Guide',
    description: 'Get up and running in 5 minutes with our comprehensive setup guide',
    difficulty: 'Beginner',
    category: 'Setup',
    readTime: '5 min',
    sections: [
      {
        id: 'introduction',
        title: 'Welcome to ApplyFlow',
        content: [
          'ApplyFlow is your comprehensive job application management system designed to streamline your job search process. Whether you\'re just starting your career or looking to make a move, ApplyFlow provides the tools you need to stay organized, track progress, and land your dream job.',
          'This quick start guide will walk you through the essential features and get you up and running in just 5 minutes.'
        ],
        tips: [
          'Take your time to explore each feature - there\'s no rush!',
          'Use the dashboard to get a bird\'s eye view of your job search progress',
          'Set up notifications to stay on top of important deadlines'
        ]
      },
      {
        id: 'account-setup',
        title: 'Setting Up Your Account',
        content: [
          'Your ApplyFlow account is your personal command center for managing your job search. Let\'s get you set up with a profile that showcases your professional journey.',
          'Start by entering your basic information, work history, and skills. This information will help you track your progress and provide insights into your job search patterns.'
        ],
        examples: [
          {
            title: 'Profile Information',
            description: 'Add your professional details including current role, experience level, and industry preferences.',
            code: `{
  "name": "John Doe",
  "title": "Software Engineer",
  "experience": "5 years",
  "industry": "Technology",
  "location": "San Francisco, CA"
}`
          }
        ]
      },
      {
        id: 'first-application',
        title: 'Adding Your First Application',
        content: [
          'Now for the exciting part - tracking your first job application! ApplyFlow makes it easy to keep all your application details organized in one place.',
          'Click the "Add Application" button and fill in the job details. Include the company name, position, location, salary range, and a direct link to the job posting.'
        ],
        codeSnippets: [
          {
            language: 'json',
            title: 'Application Data Structure',
            code: `{
  "title": "Senior Software Engineer",
  "company": "Tech Corp",
  "location": "Remote",
  "salary": "$120k - $150k",
  "status": "applied",
  "priority": "high",
  "url": "https://example.com/job/123",
  "description": "Exciting opportunity to work on cutting-edge projects...",
  "appliedDate": "2024-01-15"
}`
          }
        ]
      },
      {
        id: 'dashboard-tour',
        title: 'Understanding Your Dashboard',
        content: [
          'Your dashboard is your command center. It provides a comprehensive overview of your job search progress, upcoming interviews, and application statistics.',
          'The dashboard is divided into several key sections that help you track different aspects of your job search journey.'
        ],
        tips: [
          'Check your dashboard daily for updates and new opportunities',
          'Use the analytics section to identify patterns in your application success',
          'Set up custom views to focus on what matters most to you'
        ],
        warnings: [
          'Don\'t get overwhelmed by the data - focus on 2-3 key metrics that matter most to your goals',
          'Remember that job search is a marathon, not a sprint - consistency is key'
        ]
      }
    ],
    relatedArticles: ['account-setup', 'dashboard-tour', 'application-tracking']
  },
  'account-setup': {
    id: 'account-setup',
    title: 'Account Setup & Profile',
    description: 'Configure your profile and preferences for optimal experience',
    difficulty: 'Beginner',
    category: 'Setup',
    readTime: '8 min',
    sections: [
      {
        id: 'profile-creation',
        title: 'Creating Your Professional Profile',
        content: [
          'Your professional profile is the foundation of your ApplyFlow experience. It helps you track your career journey and provides valuable insights into your job search patterns.',
          'Start with the basics: your name, current role, years of experience, and industry. This information helps ApplyFlow provide personalized recommendations and insights.'
        ],
        examples: [
          {
            title: 'Complete Profile Example',
            description: 'Here\'s what a well-filled profile looks like:',
            code: `{
  "personalInfo": {
    "name": "Sarah Johnson",
    "title": "Product Manager",
    "experience": "7 years",
    "location": "New York, NY",
    "industry": "Technology"
  },
  "preferences": {
    "remoteWork": true,
    "salaryRange": "$120k - $160k",
    "companySize": "50-200",
    "jobTypes": ["full-time", "contract"]
  },
  "skills": [
    "Product Strategy",
    "User Research",
    "Data Analysis",
    "Agile/Scrum",
    "Roadmapping"
  ]
}`
          }
        ]
      },
      {
        id: 'preferences',
        title: 'Setting Your Preferences',
        content: [
          'Preferences help ApplyFlow tailor the experience to your specific needs. Configure notification settings, privacy options, and display preferences.',
          'Set up job search criteria to receive relevant recommendations and alerts for positions that match your profile.'
        ],
        tips: [
          'Be specific about your preferences to get better job recommendations',
          'Set realistic salary ranges based on your experience and location',
          'Consider work-life balance when setting preferences for remote/hybrid work'
        ]
      },
      {
        id: 'privacy-settings',
        title: 'Privacy and Security Settings',
        content: [
          'Your data security is our top priority. Configure privacy settings to control how your information is used and shared.',
          'Enable two-factor authentication for added security, and review data sharing preferences regularly.'
        ],
        warnings: [
          'Never share your login credentials with anyone',
          'Use a strong, unique password for your ApplyFlow account',
          'Review connected apps and revoke access for services you no longer use'
        ]
      }
    ],
    relatedArticles: ['quick-start', 'privacy-settings', 'security-best']
  },
  'application-tracking': {
    id: 'application-tracking',
    title: 'Application Tracking System',
    description: 'Master the art of organizing and tracking your job applications',
    difficulty: 'Intermediate',
    category: 'Applications',
    readTime: '12 min',
    sections: [
      {
        id: 'tracking-basics',
        title: 'Understanding Application Tracking',
        content: [
          'Application tracking is the core feature of ApplyFlow. It helps you maintain organized records of all your job applications, from initial interest to final offer.',
          'Each application in ApplyFlow contains comprehensive information including job details, application status, interview stages, and communication history.'
        ],
        codeSnippets: [
          {
            language: 'javascript',
            title: 'Application Status Flow',
            code: `const applicationStatus = {
  wishlist: 'Interested in applying',
  applied: 'Application submitted',
  interviewing: 'Interview process active',
  offered: 'Job offer received',
  accepted: 'Offer accepted',
  rejected: 'Application rejected',
  withdrawn: 'Withdrew application'
};`
          }
        ]
      },
      {
        id: 'status-management',
        title: 'Managing Application Status',
        content: [
          'Keep your application status up-to-date to maintain accurate records and get meaningful insights from your job search analytics.',
          'ApplyFlow provides a visual pipeline that shows where each application stands in the hiring process.'
        ],
        examples: [
          {
            title: 'Status Update Best Practices',
            description: 'Update your status as soon as you hear back from companies:',
            code: `// When you submit an application
updateApplicationStatus(jobId, 'applied', {
  applicationDate: new Date(),
  method: 'online',
  notes: 'Applied through company website'
});

// When you get an interview
updateApplicationStatus(jobId, 'interviewing', {
  interviewDate: '2024-01-20',
  interviewType: 'technical',
  interviewer: 'Jane Smith - Engineering Manager'
});`
          }
        ]
      },
      {
        id: 'interview-tracking',
        title: 'Interview Process Management',
        content: [
          'Track multiple interview rounds, interviewer information, and preparation notes for each application.',
          'Use the interview tracking feature to stay organized and prepare effectively for each stage of the hiring process.'
        ],
        tips: [
          'Add interview details immediately after scheduling',
          'Include interviewer names and roles for better preparation',
          'Set reminders for upcoming interviews',
          'Take notes immediately after each interview for future reference'
        ]
      }
    ],
    relatedArticles: ['ai-assistant', 'analytics', 'first-application']
  },
  'ai-assistant': {
    id: 'ai-assistant',
    title: 'AI Assistant Features',
    description: 'Leverage AI for resume optimization and interview preparation',
    difficulty: 'Intermediate',
    category: 'AI',
    readTime: '15 min',
    sections: [
      {
        id: 'ai-overview',
        title: 'Introduction to AI Assistant',
        content: [
          'ApplyFlow\'s AI Assistant is your personal job search coach, providing intelligent insights and recommendations to optimize your application strategy.',
          'The AI analyzes your application patterns, resume content, and interview performance to provide actionable advice.'
        ],
        tips: [
          'The more data you provide, the better the AI recommendations',
          'Review AI suggestions regularly but trust your judgment',
          'Use AI insights to identify patterns you might miss'
        ]
      },
      {
        id: 'resume-optimization',
        title: 'Resume Optimization with AI',
        content: [
          'Get personalized resume recommendations based on job descriptions and industry standards.',
          'The AI analyzes job postings and suggests improvements to make your resume more impactful and ATS-friendly.'
        ],
        examples: [
          {
            title: 'AI Resume Analysis',
            description: 'The AI provides detailed feedback on your resume:',
            code: `{
  "analysis": {
    "atsScore": 85,
    "keywordMatch": 92,
    "readability": 78,
    "impact": 88
  },
  "recommendations": [
    "Add quantifiable achievements for each role",
    "Include more industry-specific keywords",
    "Improve bullet point structure for better readability",
    "Add a professional summary at the top"
  ],
  "missingKeywords": [
    "project management",
    "stakeholder communication",
    "cross-functional collaboration"
  ]
}`
          }
        ]
      },
      {
        id: 'interview-prep',
        title: 'AI-Powered Interview Preparation',
        content: [
          'Prepare for interviews with AI-generated questions, company insights, and personalized tips based on the job description.',
          'The AI analyzes the role requirements and your background to suggest relevant questions and talking points.'
        ],
        codeSnippets: [
          {
            language: 'json',
            title: 'Interview Prep Data Structure',
            code: `{
  "interviewPrep": {
    "likelyQuestions": [
      "Tell me about a time you led a cross-functional project",
      "How do you handle competing priorities?",
      "Describe your approach to stakeholder management"
    ],
    "companyInsights": {
      "culture": "Collaborative and fast-paced",
      "values": ["Innovation", "Customer Focus", "Teamwork"],
      "interviewStyle": "Behavioral and technical rounds"
    },
    "talkingPoints": [
      "Highlight your experience with remote team leadership",
      "Emphasize your data-driven decision making",
      "Share examples of successful project outcomes"
    ]
  }
}`
          }
        ]
      }
    ],
    relatedArticles: ['application-tracking', 'analytics', 'first-application']
  },
  'analytics': {
    id: 'analytics',
    title: 'Analytics & Insights',
    description: 'Understand your job search metrics and improve your strategy',
    difficulty: 'Intermediate',
    category: 'Analytics',
    readTime: '10 min',
    sections: [
      {
        id: 'metrics-overview',
        title: 'Understanding Your Job Search Metrics',
        content: [
          'Analytics provide valuable insights into your job search performance. Track application rates, interview conversion, and offer rates to optimize your strategy.',
          'ApplyFlow automatically calculates key metrics and provides visual representations of your job search progress.'
        ],
        codeSnippets: [
          {
            language: 'javascript',
            title: 'Key Metrics Calculation',
            code: `const jobSearchMetrics = {
  applicationRate: applicationsPerWeek,
  responseRate: (responses / applications) * 100,
  interviewRate: (interviews / applications) * 100,
  offerRate: (offers / interviews) * 100,
  averageTimeToResponse: 'days',
  successRate: (offers / applications) * 100
};`
          }
        ]
      },
      {
        id: 'performance-analysis',
        title: 'Analyzing Your Performance',
        content: [
          'Deep dive into your application patterns to identify what\'s working and what needs improvement.',
          'Compare your metrics against industry benchmarks and track progress over time.'
        ],
        examples: [
          {
            title: 'Performance Dashboard',
            description: 'Your analytics dashboard shows:',
            code: `{
  "weeklyStats": {
    "applications": 12,
    "responses": 4,
    "interviews": 2,
    "offers": 1
  },
  "monthlyTrends": {
    "applicationGrowth": "+15%",
    "responseRateImprovement": "+8%",
    "interviewConversionRate": "16.7%"
  },
  "topPerformingApplications": [
    "Direct company applications",
    "Referral-based applications",
    "Networking events"
  ]
}`
          }
        ]
      },
      {
        id: 'optimization-tips',
        title: 'Optimizing Your Strategy',
        content: [
          'Use data-driven insights to refine your job search approach and improve your success rates.',
          'Identify patterns in successful applications and replicate those strategies across your job search.'
        ],
        tips: [
          'Focus on application channels with higher response rates',
          'Optimize your resume based on successful applications',
          'Time your applications for better visibility',
          'Leverage your network for higher conversion rates'
        ]
      }
    ],
    relatedArticles: ['application-tracking', 'ai-assistant', 'automation']
  },
  'automation': {
    id: 'automation',
    title: 'Automation Workflows',
    description: 'Set up automated workflows for repetitive tasks',
    difficulty: 'Advanced',
    category: 'Automation',
    readTime: '20 min',
    sections: [
      {
        id: 'automation-basics',
        title: 'Introduction to Automation',
        content: [
          'Automation workflows save you time by handling repetitive tasks automatically. Set up triggers and actions to streamline your job search process.',
          'ApplyFlow\'s automation system allows you to create custom workflows based on your specific needs and preferences.'
        ],
        codeSnippets: [
          {
            language: 'javascript',
            title: 'Workflow Structure',
            code: `const automationWorkflow = {
  trigger: 'application_submitted',
  conditions: [
    'company_size > 100',
    'role matches skills'
  ],
  actions: [
    'set_follow_up_reminder',
    'update_status_to_tracking',
    'send_notification'
  ],
  schedule: 'immediate'
};`
          }
        ]
      },
      {
        id: 'common-workflows',
        title: 'Common Automation Workflows',
        content: [
          'Explore pre-built automation templates for common job search tasks and customize them to fit your needs.',
          'These workflows are designed based on best practices from successful job seekers.'
        ],
        examples: [
          {
            title: 'Follow-up Reminder Workflow',
            description: 'Automatically remind yourself to follow up on applications:',
            code: `{
  "name": "Follow-up Reminder",
  "trigger": "status_changed_to_applied",
  "actions": [
    {
      "type": "schedule_reminder",
      "delay": "7_days",
      "message": "Follow up on {company} application"
    },
    {
      "type": "create_task",
      "task": "Prepare follow-up email template"
    }
  ]
}`
          },
          {
            title: 'Interview Preparation Workflow',
            description: 'Automatically prepare for upcoming interviews:',
            code: `{
  "name": "Interview Prep",
  "trigger": "interview_scheduled",
  "actions": [
    {
      "type": "generate_questions",
      "source": "job_description"
    },
    {
      "type": "research_company",
      "targets": ["recent_news", "key_executives", "culture"]
    },
    {
      "type": "schedule_reminder",
      "delay": "1_day_before",
      "message": "Final interview prep for {company}"
    }
  ]
}`
          }
        ]
      },
      {
        id: 'custom-automation',
        title: 'Building Custom Workflows',
        content: [
          'Create sophisticated automation workflows tailored to your specific job search strategy and preferences.',
          'Use advanced conditions and actions to build intelligent workflows that adapt to your needs.'
        ],
        tips: [
          'Start simple and gradually add complexity to your workflows',
          'Test workflows with sample data before deploying them',
          'Monitor workflow performance and optimize regularly',
          'Use error handling to manage exceptions gracefully'
        ],
        warnings: [
          "Don't over-automate - maintain personal touch in communications",
          "Review automated actions before they execute",
          "Keep backup plans for critical tasks"
        ]
      }
    ],
    relatedArticles: ['integrations', 'data-export', 'api-usage']
  },
  'security-best': {
    id: 'security-best',
    title: 'Security Best Practices',
    description: 'Essential security practices for your account',
    difficulty: 'Intermediate',
    category: 'Security',
    readTime: '10 min',
    sections: [
      {
        id: 'account-security',
        title: 'Securing Your Account',
        content: [
          'Protect your job search data with strong security practices. Your account contains sensitive personal and professional information that requires proper protection.',
          'Implement multiple layers of security to ensure your data remains safe and private.'
        ],
        tips: [
          'Use a unique, complex password for ApplyFlow',
          'Enable two-factor authentication (2FA)',
          'Regularly review your account activity',
          'Keep your contact information up to date'
        ],
        warnings: [
          'Never share your password or 2FA codes',
          'Avoid using public Wi-Fi for sensitive operations',
          'Log out from shared devices after use'
        ]
      },
      {
        id: 'data-protection',
        title: 'Data Protection Best Practices',
        content: [
          'Understand how your data is stored and protected. ApplyFlow uses industry-standard encryption and security measures.',
          'Learn about your rights and responsibilities regarding data protection.'
        ],
        examples: [
          {
            title: 'Security Settings Configuration',
            description: 'Recommended security settings:',
            code: `{
  "securitySettings": {
    "twoFactorAuth": true,
    "sessionTimeout": "30_minutes",
    "loginNotifications": true,
    "dataEncryption": "AES-256",
    "backupFrequency": "daily",
    "accessLogs": "enabled"
  },
  "privacyControls": {
    "profileVisibility": "private",
    "dataSharing": "limited",
    "analyticsOptIn": true,
    "marketingEmails": false
  }
}`
          }
        ]
      },
      {
        id: 'threat-prevention',
        title: 'Preventing Security Threats',
        content: [
          'Learn to identify and prevent common security threats like phishing attempts and unauthorized access.',
          'Stay informed about the latest security best practices and threats.'
        ],
        tips: [
          'Verify email sender addresses before clicking links',
          'Use official channels for support requests',
          'Keep your browser and software updated',
          'Use reputable antivirus software'
        ]
      }
    ],
    relatedArticles: ['privacy-settings', 'data-retention', 'compliance']
  }
};

export default function DocumentationDetail() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState(false);

  const docContent = documentationContent[articleId || ''];

  useEffect(() => {
    if (!docContent) {
      navigate('/app/documentation');
    }
  }, [docContent, navigate]);

  if (!docContent) {
    return <div>Loading...</div>;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSectionComplete = (sectionId: string) => {
    setCompletedSections(prev => new Set(prev).add(sectionId));
  };

  const handleDownloadPDF = async () => {
    try {
      if (!PDFExporter.validateExportData(docContent as unknown as Record<string, unknown>)) {
        throw new Error('Invalid documentation data');
      }

      const filename = `${docContent.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      await PDFExporter.exportDocumentationToPDF(docContent as unknown as Record<string, unknown>, completedSections, filename);

      // Show success notification (you might want to integrate with your notification system)

    } catch {
      // Show error notification
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/app/documentation/${articleId}`;
    if (navigator.share) {
      navigator.share({
        title: docContent.title,
        text: docContent.description,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const progress = (completedSections.size / docContent.sections.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/app/documentation')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documentation
          </Button>
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(docContent.difficulty)}`}>
              {docContent.difficulty}
            </span>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {docContent.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {docContent.readTime}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">{docContent.title}</h1>
            <p className="text-xl text-slate-600">{docContent.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setBookmarked(!bookmarked)}>
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Reading Progress</span>
            <span className="text-sm text-slate-500">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table of Contents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Table of Contents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {docContent.sections.map((section, index) => (
              <div key={section.id} className="flex items-center gap-2">
                <button
                  onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                >
                  <span className="text-slate-400">{index + 1}.</span>
                  <span className="text-slate-700">{section.title}</span>
                  {completedSections.has(section.id) && (
                    <CheckCircle className="w-4 h-4 text-green-500 fill-current" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-8">
        {docContent.sections.map((section, index) => (
          <motion.div
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <CardTitle className="text-2xl">{section.title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSectionComplete(section.id)}
                    disabled={completedSections.has(section.id)}
                  >
                    <CheckCircle className={`w-4 h-4 ${completedSections.has(section.id) ? 'fill-current text-green-500' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Content */}
                <div className="prose prose-slate max-w-none">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-slate-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Code Snippets */}
                {section.codeSnippets && section.codeSnippets.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Code Examples
                    </h4>
                    {section.codeSnippets.map((snippet, sIndex) => (
                      <div key={sIndex} className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                        {snippet.title && (
                          <div className="text-sm text-slate-400 mb-2">{snippet.title}</div>
                        )}
                        <pre className="text-slate-100 text-sm">
                          <code>{snippet.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* Examples */}
                {section.examples && section.examples.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Examples
                    </h4>
                    {section.examples.map((example, eIndex) => (
                      <div key={eIndex} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-900 mb-2">{example.title}</h5>
                        <p className="text-blue-800 mb-3">{example.description}</p>
                        {example.code && (
                          <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto">
                            <pre className="text-slate-100 text-sm">
                              <code>{example.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Tips */}
                {section.tips && section.tips.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Pro Tips
                    </h4>
                    {section.tips.map((tip, tIndex) => (
                      <div key={tIndex} className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                        <Star className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <p className="text-green-800">{tip}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {section.warnings && section.warnings.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Important Notes
                    </h4>
                    {section.warnings.map((warning, wIndex) => (
                      <div key={wIndex} className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                        <p className="text-yellow-800">{warning}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Related Articles */}
      {docContent.relatedArticles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Related Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docContent.relatedArticles.map((relatedId) => {
                const relatedDoc = documentationContent[relatedId];
                if (!relatedDoc) return null;
                return (
                  <Link
                    key={relatedId}
                    to={`/app/documentation/${relatedId}`}
                    className="block p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">{relatedDoc.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{relatedDoc.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engagement */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                Helpful
              </Button>
              <Button variant="ghost" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Feedback
              </Button>
            </div>
            <div className="text-sm text-slate-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
