import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Clock, CheckCircle, Plus, ArrowRight, Sparkles, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CountUp } from '../components/shared/CountUp';
import { useJobStore, useActivityStore, useAuthStore } from '../features';
import { useNavigate } from 'react-router-dom';
import { staggerContainer, listItem, motionConfig } from '../lib/motion';
import { EmptyState } from '../components/shared/EmptyState';
import { useState } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { jobs } = useJobStore();
  const { getFilteredActivities } = useActivityStore();
  const { isAIAdmin } = useAuthStore();
  const [aiTipIndex, setAiTipIndex] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const aiTips = [
    {
      title: 'Follow Up Strategy',
      tip: 'Send a follow-up email 3-5 days after your interview. It shows enthusiasm and keeps you top of mind.',
      category: 'interview',
      recommendations: [
        'Send a personalized thank you email within 24 hours',
        'Connect with interviewers on LinkedIn',
        'Ask about next steps in the process',
        'Reiterate your interest in the position'
      ]
    },
    {
      title: 'Resume Optimization',
      tip: 'Tailor your resume for each application. Highlight relevant skills and use keywords from the job description.',
      category: 'resume',
      recommendations: [
        'Use action verbs to describe achievements',
        'Quantify results with numbers and percentages',
        'Keep it to one page for most positions',
        'Include a professional summary at the top'
      ]
    },
    {
      title: 'Network Smart',
      tip: 'Connect with employees at your target companies on LinkedIn. Personal connections can get your resume noticed.',
      category: 'networking',
      recommendations: [
        'Join industry-specific LinkedIn groups',
        'Attend virtual networking events',
        'Request informational interviews',
        'Share relevant industry content'
      ]
    },
    {
      title: 'Practice Interviews',
      tip: 'Practice common interview questions with a friend or use mock interview tools to build confidence.',
      category: 'interview',
      recommendations: [
        'Record yourself practicing answers',
        'Research STAR method for behavioral questions',
        'Prepare questions to ask the interviewer',
        'Practice with mock interview platforms'
      ]
    },
    {
      title: 'Track Everything',
      tip: 'Keep detailed notes on each application. Follow up on promises made during interviews.',
      category: 'organization',
      recommendations: [
        'Use a spreadsheet or tracking tool',
        'Set calendar reminders for follow-ups',
        'Document interview feedback',
        'Track application deadlines'
      ]
    },
    {
      title: 'Research Companies',
      tip: 'Before applying, research the company culture, values, and recent news. This helps in interviews and shows genuine interest.',
      category: 'research',
      recommendations: [
        'Read recent company blog posts',
        'Follow company leaders on social media',
        'Check employee reviews on Glassdoor',
        'Understand their products and services'
      ]
    },
    {
      title: 'Cover Letters',
      tip: 'Write personalized cover letters for each application. Address specific needs mentioned in the job posting.',
      category: 'application',
      recommendations: [
        'Address the hiring manager by name',
        'Mention specific company initiatives',
        'Connect your skills to their needs',
        'Keep it under one page'
      ]
    },
    {
      title: 'Salary Negotiation',
      tip: 'Research market rates for your role and experience. Be prepared to discuss salary expectations confidently.',
      category: 'negotiation',
      recommendations: [
        'Use salary research tools like Glassdoor',
        'Know your worth based on experience',
        'Consider total compensation package',
        'Practice negotiation scenarios'
      ]
    },
    {
      title: 'Stay Organized',
      tip: 'Use a spreadsheet or tracking tool to manage deadlines, interview dates, and follow-up reminders.',
      category: 'organization',
      recommendations: [
        'Set up a job search calendar',
        'Create folders for each company',
        'Use project management tools',
        'Backup your data regularly'
      ]
    },
    {
      title: 'Build Portfolio',
      tip: 'Showcase your best work online. A strong portfolio can set you apart from other candidates.',
      category: 'portfolio',
      recommendations: [
        'Create a personal website',
        'Use platforms like GitHub or Behance',
        'Include case studies of your work',
        'Keep it updated with recent projects'
      ]
    },
    {
      title: 'Learn New Skills',
      tip: 'Identify skill gaps in job descriptions and take courses to fill them. Continuous learning shows growth mindset.',
      category: 'skills',
      recommendations: [
        'Take online courses on Coursera or Udemy',
        'Earn relevant certifications',
        'Work on personal projects',
        'Attend workshops and webinars'
      ]
    },
    {
      title: 'Ask Questions',
      tip: 'Prepare thoughtful questions for interviewers. It demonstrates your interest and engagement.',
      category: 'interview',
      recommendations: [
        'Ask about team culture',
        'Inquire about growth opportunities',
        'Question about current challenges',
        'Learn about the company vision'
      ]
    },
  ];

  const handleRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * aiTips.length);
    setAiTipIndex(randomIndex);
    setShowRecommendations(true);
  };

  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === 'applied').length,
    interview: jobs.filter((j) => j.status === 'interview').length,
    offer: jobs.filter((j) => j.status === 'offer').length,
  };

  const getPersonalizedTip = () => {
    if (jobs.length === 0) return { title: 'Get Started', tip: 'Add your first job application to begin tracking your job search journey with AI-powered insights.', category: 'onboarding', recommendations: ['Add your first job application', 'Set up your profile', 'Explore the dashboard'] };
    if (stats.interview > 0) return { title: 'Interview Prep', tip: `You have ${stats.interview} interview(s) scheduled. Research the company and prepare questions to ask the interviewer.`, category: 'interview', recommendations: ['Research the company', 'Prepare questions to ask', 'Practice common interview questions'] };
    if (stats.applied > 5) return { title: 'Follow Up', tip: 'Consider following up on applications submitted over a week ago. A polite email can rekindle interest.', category: 'followup', recommendations: ['Send follow-up emails', 'Check application status', 'Connect on LinkedIn'] };
    if (stats.offer > 0) return { title: 'Congratulations!', tip: `You have ${stats.offer} offer(s)! Review them carefully and consider your options before accepting.`, category: 'success', recommendations: ['Review offer details', 'Compare with other offers', 'Negotiate if appropriate'] };
    return aiTips[aiTipIndex];
  };

  const personalizedTip = getPersonalizedTip();

  const getActionableInsights = () => {
    const insights = [];
    if (stats.total === 0) insights.push({ action: 'Add Job', route: '/app/applications', priority: 'high' });
    if (stats.applied > 0 && stats.interview === 0) insights.push({ action: 'Follow Up', route: '/app/applications', priority: 'medium' });
    if (stats.total > 5) insights.push({ action: 'View Analytics', route: '/app/analytics', priority: 'low' });
    if (stats.interview > 0) insights.push({ action: 'Prepare Interview', route: '/app/applications', priority: 'high' });
    return insights.slice(0, 3);
  };

  const actionableInsights = getActionableInsights();

  const recentActivities = getFilteredActivities().slice(0, 5);

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      <motion.div variants={listItem} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <p className="text-black/70 mt-0.5">
            Welcome back! Here's your job search overview.
          </p>
        </div>
        <Button onClick={() => navigate('/app/applications')}>
          <Plus className="mr-2 h-5 w-5" />
          Add Job
        </Button>
      </motion.div>

      <motion.div variants={listItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-black/70">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={motionConfig.smooth}
              >
                <CountUp value={stats.total} className="text-4xl font-bold text-black" />
              </motion.div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shadow-high-key group-hover:shadow-glow-blue transition-shadow">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-black/70">
              Applied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...motionConfig.smooth, delay: 0.1 }}
              >
                <CountUp value={stats.applied} className="text-4xl font-bold text-black" />
              </motion.div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shadow-high-key group-hover:shadow-glow-blue transition-shadow">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-black/70">
              Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...motionConfig.smooth, delay: 0.2 }}
              >
                <CountUp value={stats.interview} className="text-4xl font-bold text-black" />
              </motion.div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shadow-high-key group-hover:shadow-glow-blue transition-shadow">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-black/70">
              Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...motionConfig.smooth, delay: 0.3 }}
              >
                <CountUp value={stats.offer} className="text-4xl font-bold text-black" />
              </motion.div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shadow-high-key group-hover:shadow-glow-blue transition-shadow">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Assistant Card */}
        <motion.div variants={listItem}>
          <Card className={`bg-gradient-to-br from-blue-50 to-white border-blue-200 ${isAIAdmin() ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-high-key ${isAIAdmin() ? 'bg-blue-600' : 'bg-blue-500'}`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-black">
                  {isAIAdmin() ? 'AI Vice-President' : 'AI Job Manager'}
                </CardTitle>
                <Badge variant={isAIAdmin() ? 'success' : 'info'} className="ml-auto">
                  {isAIAdmin() ? 'Admin' : 'Beta'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Tip */}
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-blue-100">
                  <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-black">{personalizedTip.title}</h4>
                      <Badge variant="default" className="text-xs">{personalizedTip.category || 'tip'}</Badge>
                    </div>
                    <p className="text-sm text-black/70 leading-relaxed">{personalizedTip.tip}</p>
                  </div>
                </div>

                {/* Recommendations */}
                {showRecommendations && personalizedTip.recommendations && (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-xs font-semibold text-blue-800 mb-2">Recommended Actions:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      {personalizedTip.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Admin Capabilities */}
                {isAIAdmin() && (
                  <div className="p-3 bg-blue-100 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800 font-semibold mb-2">Vice-President Capabilities Active:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Monitor user activity</li>
                      <li>• Create job applications</li>
                      <li>• Track real-time activity</li>
                      <li>• Change settings</li>
                      <li>• View/edit companies</li>
                      <li>• Access analytics</li>
                    </ul>
                  </div>
                )}

                {/* Actionable Insights */}
                {actionableInsights.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-black/60 uppercase tracking-wider">Suggested Actions</p>
                    {actionableInsights.map((insight, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(insight.route)}
                        className={`w-full justify-start ${insight.priority === 'high' ? 'bg-red-50 text-red-700 hover:bg-red-100' :
                          insight.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' :
                            'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        {insight.action}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleRandomTip}
                    className="flex-1"
                  >
                    Random Tip
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/app/analytics')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                  >
                    Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={listItem}>
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="No applications yet"
                  description="Start tracking your job applications to see them here."
                  action={{
                    label: 'Add Your First Job',
                    onClick: () => navigate('/app/applications'),
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...motionConfig.smooth, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-black/4 transition-colors cursor-pointer"
                      onClick={() => navigate('/app/applications')}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black truncate">{job.title}</p>
                        <p className="text-sm text-black/70">{job.company}</p>
                      </div>
                      <Badge
                        variant={
                          job.status === 'offer'
                            ? 'success'
                            : job.status === 'interview'
                              ? 'info'
                              : job.status === 'rejected'
                                ? 'error'
                                : 'default'
                        }
                      >
                        {job.status}
                      </Badge>
                    </motion.div>
                  ))}
                  {jobs.length > 5 && (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => navigate('/app/applications')}
                    >
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={listItem}>
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="No recent activity"
                  description="Your activity will appear here as you track jobs."
                />
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...motionConfig.smooth, delay: index * 0.05 }}
                      className="flex items-start gap-4 p-4 rounded-xl border border-border"
                    >
                      <div className="h-2 w-2 rounded-full bg-black mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-black">{activity.title}</p>
                        <p className="text-sm text-black/70 mt-0.5">
                          {activity.description}
                        </p>
                        <p className="text-xs text-black/50 mt-1">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
