import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  Video,
  FileText,
  Download,
  Search,
  HelpCircle,
  Zap,
  Shield,
  Users,
  Clock,
  Star,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Award,
  CheckCircle,
  TrendingUp,
  Building2,
  ThumbsUp,
  Quote,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNotificationStore } from '../features';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

interface TrustMetric {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  icon: React.ComponentType<{ className?: string }>;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Google',
    content: 'ApplyFlow transformed my job search. I landed my dream job at Google in just 3 months! The AI assistant helped me optimize my resume and prepare for interviews.',
    rating: 5,
    avatar: 'SC'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Manager',
    company: 'Meta',
    content: 'The application tracking feature is incredible. I could see exactly where I was in the hiring process for each company. Highly recommended!',
    rating: 5,
    avatar: 'MR'
  },
  {
    name: 'Emily Watson',
    role: 'Data Scientist',
    company: 'Amazon',
    content: 'The analytics dashboard gave me insights I never had before. I could track my response rates and improve my application strategy.',
    rating: 5,
    avatar: 'EW'
  },
  {
    name: 'David Kim',
    role: 'Senior Developer',
    company: 'Microsoft',
    content: 'Best job application tracker I\'ve used. The clean interface and powerful features make managing multiple applications effortless.',
    rating: 5,
    avatar: 'DK'
  }
];

const trustMetrics: TrustMetric[] = [
  { label: 'Users Worldwide', value: '50K+', icon: Users },
  { label: 'Jobs Tracked', value: '2M+', icon: TrendingUp },
  { label: 'Success Rate', value: '87%', icon: Award },
  { label: 'Companies', value: '10K+', icon: Building2 }
];

// Partner companies list available for future use

const faqItems: FAQItem[] = [
  {
    question: "How do I create a new job application?",
    answer: "Click the 'Add Application' button in the Applications page, fill in the job details including company name, position, location, and salary. You can also add a job URL to auto-fill some information.",
    category: "Applications"
  },
  {
    question: "Can I track multiple applications at once?",
    answer: "Yes! ApplyFlow allows you to manage unlimited job applications. You can view them in a list or kanban board format, filter by status, and track your progress through each stage.",
    category: "Applications"
  },
  {
    question: "How does the AI assistant help me?",
    answer: "The AI assistant provides personalized career guidance, helps optimize your resume, suggests follow-up actions, analyzes your application patterns, and can even help prepare for interviews based on the job descriptions.",
    category: "AI Assistant"
  },
  {
    question: "Can I export my data?",
    answer: "Yes! Go to Settings > Data Management and click 'Export Data' to download all your applications, settings, and profile information in JSON format.",
    category: "Data Management"
  },
  {
    question: "How do I set up interview reminders?",
    answer: "Enable notifications in Settings > Notifications. The system will automatically remind you of upcoming interviews and follow-up dates based on your application timeline.",
    category: "Notifications"
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely! All data is stored locally in your browser and encrypted. We never share your personal information with third parties without your explicit consent.",
    category: "Privacy & Security"
  }
];

const helpArticles: HelpArticle[] = [
  {
    id: 'getting-started',
    title: 'Getting Started Guide',
    description: 'Learn the basics of ApplyFlow and set up your profile for maximum efficiency.',
    category: 'Quick Start',
    readTime: '5 min',
    icon: BookOpen
  },
  {
    id: 'application-tracking',
    title: 'Application Tracking Best Practices',
    description: 'Master the art of organizing and tracking your job applications effectively.',
    category: 'Applications',
    readTime: '8 min',
    icon: FileText
  },
  {
    id: 'ai-features',
    title: 'Using AI Assistant Features',
    description: 'Discover how to leverage AI for resume optimization and interview preparation.',
    category: 'AI Assistant',
    readTime: '6 min',
    icon: Zap
  },
  {
    id: 'privacy-guide',
    title: 'Privacy and Security Guide',
    description: 'Understand how we protect your data and configure your privacy settings.',
    category: 'Privacy & Security',
    readTime: '4 min',
    icon: Shield
  },
  {
    id: 'notifications-setup',
    title: 'Setting Up Notifications',
    description: 'Configure notifications to stay on top of your job search activities.',
    category: 'Notifications',
    readTime: '3 min',
    icon: MessageCircle
  },
  {
    id: 'data-management',
    title: 'Managing Your Data',
    description: 'Learn how to export, import, and backup your application data.',
    category: 'Data Management',
    readTime: '5 min',
    icon: Download
  }
];

const categories = ['All', 'Applications', 'AI Assistant', 'Notifications', 'Privacy & Security', 'Data Management'];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const { addNotification } = useNotificationStore();

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);

    // Show success message (in real app, this would be a toast)
    alert('Your message has been sent! We\'ll get back to you soon.');
  };

  const handleComingSoon = (feature: string) => {
    addNotification({
      type: 'info',
      title: 'Coming Soon',
      message: `${feature} feature is coming soon! Stay tuned.`
    });
  };

  const openArticleModal = (article: HelpArticle) => {
    setSelectedArticle(article);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Trust Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trustMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-border rounded-2xl p-6 text-center shadow-high-key hover:shadow-glow transition-all"
            >
              <Icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-black mb-1">{metric.value}</div>
              <div className="text-sm text-black/60">{metric.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Testimonials Carousel */}
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-blue-600" />
            Success Stories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-glow-blue">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg text-black/80 mb-4 italic">"{testimonials[currentTestimonial].content}"</p>
                <div className="font-semibold text-black">{testimonials[currentTestimonial].name}</div>
                <div className="text-sm text-black/60">{testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}</div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentTestimonial ? "bg-blue-500 w-6" : "bg-black/20"
                    )}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">Help Center</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Everything you need to know about ApplyFlow and how to make the most of your job search journey.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for help articles, FAQs, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-auto p-4"
          onClick={() => handleComingSoon('Video Tutorials')}
        >
          <Video className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Video Tutorials</div>
            <div className="text-sm text-slate-500">Watch guided tours</div>
          </div>
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-auto p-4"
          onClick={() => window.open('/app/documentation', '_blank')}
        >
          <BookOpen className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Documentation</div>
            <div className="text-sm text-slate-500">Detailed guides</div>
          </div>
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-auto p-4"
          onClick={() => window.open('/app/community', '_blank')}
        >
          <Users className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Community</div>
            <div className="text-sm text-slate-500">Join discussions</div>
          </div>
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-auto p-4"
          onClick={() => window.open('/app/livechat', '_blank')}
        >
          <MessageCircle className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Live Chat</div>
            <div className="text-sm text-slate-500">Get instant help</div>
          </div>
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Help Articles */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Help Articles</h2>
          </div>

          <div className="space-y-3">
            {filteredArticles.map(article => {
              const Icon = article.icon;
              return (
                <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openArticleModal(article)}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {article.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readTime}
                            </span>
                            <span className="bg-slate-100 px-2 py-1 rounded">
                              {article.category}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {filteredFAQs.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 pr-4">
                      {item.question}
                    </h3>
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 text-slate-400 transition-transform flex-shrink-0",
                        expandedFAQ === index && "rotate-90"
                      )}
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-1 inline-block">
                    {item.category}
                  </span>
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4 border-t border-slate-200">
                    <p className="text-slate-600 mt-3">
                      {item.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl shadow-high-key">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="font-semibold text-black">256-bit Encryption</div>
            <div className="text-sm text-black/60">Bank-level security</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl shadow-high-key">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-black">GDPR Compliant</div>
            <div className="text-sm text-black/60">Privacy first approach</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl shadow-high-key">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <ThumbsUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="font-semibold text-black">99.9% Uptime</div>
            <div className="text-sm text-black/60">Always available</div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Still Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Contact Options</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Email Support</div>
                    <div className="text-sm text-slate-500">support@applyflow.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Phone Support</div>
                    <div className="text-sm text-slate-500">Mon-Fri, 9AM-5PM EST</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Live Chat</div>
                    <div className="text-sm text-slate-500">Available 24/7</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <Input
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <Input
                  placeholder="Subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="How can we help you?"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  required
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="ghost" className="flex items-center gap-2 h-auto p-4" onClick={() => window.open('/app/resume-templates', '_blank')}>
              <FileText className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Resume Templates</div>
                <div className="text-sm text-slate-500">Professional templates</div>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>
            <Button variant="ghost" className="flex items-center gap-2 h-auto p-4" onClick={() => window.open('/app/interview-tips', '_blank')}>
              <Video className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Interview Tips</div>
                <div className="text-sm text-slate-500">Ace your interviews</div>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>
            <Button variant="ghost" className="flex items-center gap-2 h-auto p-4" onClick={() => window.open('/app/career-blog', '_blank')}>
              <BookOpen className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Career Blog</div>
                <div className="text-sm text-slate-500">Latest insights</div>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {(() => {
                        const Icon = selectedArticle.icon;
                        return <Icon className="w-5 h-5 text-blue-600" />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{selectedArticle.title}</h2>
                      <p className="text-sm text-slate-500">{selectedArticle.category} · {selectedArticle.readTime} read</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedArticle(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed">
                    {selectedArticle.description}
                  </p>
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Getting Started</h3>
                    <p className="text-slate-600">
                      This comprehensive guide will walk you through the essential features and best practices for using ApplyFlow effectively. Whether you're just starting your job search or looking to optimize your application process, this article has everything you need.
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900">Key Features</h3>
                    <ul className="list-disc pl-6 text-slate-600 space-y-2">
                      <li>Track multiple applications efficiently</li>
                      <li>Set up custom notifications</li>
                      <li>Analyze your application success rates</li>
                      <li>Collaborate with mentors and peers</li>
                    </ul>
                    <h3 className="text-lg font-semibold text-slate-900">Best Practices</h3>
                    <p className="text-slate-600">
                      Follow these proven strategies to maximize your job search success and make the most out of ApplyFlow's powerful features.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}