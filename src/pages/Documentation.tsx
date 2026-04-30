import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PDFExporter } from '../utils/pdfExport';
import {
  BookOpen,
  Search,
  Code,
  Shield,
  Zap,
  ChevronRight,
  Clock,
  Download,
  CheckCircle,
  Share2
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  articles: DocArticle[];
}

interface DocArticle {
  id: string;
  title: string;
  description: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  content?: string;
  completed?: boolean;
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Everything you need to begin your journey with ApplyFlow',
    icon: BookOpen,
    articles: [
      {
        id: 'quick-start',
        title: 'Quick Start Guide',
        description: 'Get up and running in 5 minutes with our comprehensive setup guide',
        readTime: '5 min',
        difficulty: 'Beginner',
        category: 'Setup'
      },
      {
        id: 'account-setup',
        title: 'Account Setup & Profile',
        description: 'Configure your profile and preferences for optimal experience',
        readTime: '8 min',
        difficulty: 'Beginner',
        category: 'Setup'
      },
      {
        id: 'first-application',
        title: 'Adding Your First Application',
        description: 'Learn how to track your first job application effectively',
        readTime: '6 min',
        difficulty: 'Beginner',
        category: 'Applications'
      },
      {
        id: 'dashboard-tour',
        title: 'Dashboard Overview',
        description: 'Complete tour of your dashboard and key features',
        readTime: '10 min',
        difficulty: 'Beginner',
        category: 'Interface'
      }
    ]
  },
  {
    id: 'features',
    title: 'Features & Tools',
    description: 'Deep dive into ApplyFlow\'s powerful features',
    icon: Zap,
    articles: [
      {
        id: 'application-tracking',
        title: 'Application Tracking System',
        description: 'Master the art of organizing and tracking your job applications',
        readTime: '12 min',
        difficulty: 'Intermediate',
        category: 'Applications'
      },
      {
        id: 'ai-assistant',
        title: 'AI Assistant Features',
        description: 'Leverage AI for resume optimization and interview preparation',
        readTime: '15 min',
        difficulty: 'Intermediate',
        category: 'AI'
      },
      {
        id: 'analytics',
        title: 'Analytics & Insights',
        description: 'Understand your job search metrics and improve your strategy',
        readTime: '10 min',
        difficulty: 'Intermediate',
        category: 'Analytics'
      },
      {
        id: 'notifications',
        title: 'Smart Notifications',
        description: 'Configure and manage notifications to stay on top of your search',
        readTime: '7 min',
        difficulty: 'Beginner',
        category: 'Settings'
      }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Topics',
    description: 'Power user features and advanced configurations',
    icon: Code,
    articles: [
      {
        id: 'automation',
        title: 'Automation Workflows',
        description: 'Set up automated workflows for repetitive tasks',
        readTime: '20 min',
        difficulty: 'Advanced',
        category: 'Automation'
      },
      {
        id: 'integrations',
        title: 'Third-Party Integrations',
        description: 'Connect ApplyFlow with your favorite tools and services',
        readTime: '15 min',
        difficulty: 'Advanced',
        category: 'Integrations'
      },
      {
        id: 'data-export',
        title: 'Data Management & Export',
        description: 'Advanced data management, backup, and export strategies',
        readTime: '12 min',
        difficulty: 'Intermediate',
        category: 'Data'
      },
      {
        id: 'api-usage',
        title: 'API Usage & Development',
        description: 'Use our API to build custom integrations and workflows',
        readTime: '25 min',
        difficulty: 'Advanced',
        category: 'Development'
      }
    ]
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    description: 'Keep your data secure and maintain your privacy',
    icon: Shield,
    articles: [
      {
        id: 'privacy-settings',
        title: 'Privacy Settings Guide',
        description: 'Configure privacy settings to control your data',
        readTime: '8 min',
        difficulty: 'Beginner',
        category: 'Privacy'
      },
      {
        id: 'security-best',
        title: 'Security Best Practices',
        description: 'Essential security practices for your account',
        readTime: '10 min',
        difficulty: 'Intermediate',
        category: 'Security'
      },
      {
        id: 'data-retention',
        title: 'Data Retention Policies',
        description: 'Understand how we handle and retain your data',
        readTime: '6 min',
        difficulty: 'Beginner',
        category: 'Privacy'
      },
      {
        id: 'compliance',
        title: 'Compliance & Regulations',
        description: 'GDPR, CCPA, and other compliance information',
        readTime: '12 min',
        difficulty: 'Intermediate',
        category: 'Legal'
      }
    ]
  }
];

export default function Documentation() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('getting-started');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [completedArticles, setCompletedArticles] = useState<Set<string>>(new Set());

  const filteredSections = docSections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.articles.length > 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleMarkAsComplete = (articleId: string) => {
    setCompletedArticles(prev => new Set(prev).add(articleId));
  };

  const handleDownloadPDF = async (article: DocArticle) => {
    try {
      // Create comprehensive documentation data
      const docData = {
        title: article.title,
        description: article.description,
        difficulty: article.difficulty,
        category: article.category,
        readTime: article.readTime,
        sections: [
          {
            id: 'overview',
            title: 'Overview',
            content: [
              `This comprehensive guide covers everything you need to know about ${article.title.toLowerCase()}.`,
              'Follow along step-by-step to master this feature and enhance your job search experience.',
              'This documentation includes practical examples, best practices, and detailed explanations.'
            ]
          },
          {
            id: 'key-points',
            title: 'Key Points',
            content: [
              'Easy-to-follow instructions with real-world examples',
              'Best practices and pro tips for optimal results',
              'Common pitfalls and how to avoid them',
              'Advanced techniques for power users'
            ]
          },
          {
            id: 'step-by-step',
            title: 'Step-by-Step Guide',
            content: [
              'Getting Started - Begin with the basics and understand the core concepts.',
              'Implementation - Follow the detailed steps to implement the feature correctly.',
              'Optimization - Fine-tune your approach for maximum efficiency.'
            ]
          }
        ],
        codeSnippets: [
          {
            language: 'javascript',
            title: 'Example Implementation',
            code: `// Example code for ${article.title}
function example() {
  console.log('Implementing ${article.title}');
  return 'Success';
}`
          }
        ],
        tips: [
          'Take your time to understand each concept',
          'Practice with real-world examples',
          'Refer to related documentation for additional context'
        ],
        warnings: [
          'Follow security best practices when applicable',
          'Test thoroughly before implementing in production',
          'Keep documentation updated as features evolve'
        ]
      };

      if (!PDFExporter.validateExportData({ title: docData.title, content: docData.description || '' })) {
        throw new Error('Invalid documentation data');
      }

      const filename = `${article.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      await PDFExporter.exportDocumentationToPDF(docData, new Set(), filename);

      // PDF exported successfully

    } catch {
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleShare = async (article: DocArticle) => {
    try {
      // Create comprehensive documentation data for sharing
      const docData = {
        title: article.title,
        description: article.description,
        difficulty: article.difficulty,
        category: article.category,
        readTime: article.readTime,
        sections: [
          {
            id: 'overview',
            title: 'Overview',
            content: [
              `This comprehensive guide covers everything you need to know about ${article.title.toLowerCase()}.`,
              'Follow along step-by-step to master this feature and enhance your job search experience.',
              'This documentation includes practical examples, best practices, and detailed explanations.'
            ]
          },
          {
            id: 'key-points',
            title: 'Key Points',
            content: [
              'Easy-to-follow instructions with real-world examples',
              'Best practices and pro tips for optimal results',
              'Common pitfalls and how to avoid them',
              'Advanced techniques for power users'
            ]
          }
        ],
        codeSnippets: [
          {
            language: 'javascript',
            title: 'Example Implementation',
            code: `// Example code for ${article.title}
function example() {
  console.log('Implementing ${article.title}');
  return 'Success';
}`
          }
        ],
        tips: [
          'Take your time to understand each concept',
          'Practice with real-world examples',
          'Refer to related documentation for additional context'
        ]
      };

      if (!PDFExporter.validateExportData({ title: docData.title, content: docData.description || '' })) {
        throw new Error('Invalid documentation data');
      }

      const filename = `${article.title.replace(/[^a-zA-Z0-9]/g, '_')}_shared.pdf`;
      await PDFExporter.exportDocumentationToPDF(docData, new Set(), filename);

      // Documentation shared successfully

    } catch {
      alert('Failed to share documentation. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full"
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-sm font-medium">ApplyFlow Documentation</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-slate-900">Documentation</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Comprehensive guides and tutorials to help you master ApplyFlow and accelerate your job search.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-sm text-slate-600">Articles</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">4</div>
            <div className="text-sm text-slate-600">Categories</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-slate-600">Difficulty Levels</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-slate-600">Updated</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {docSections.map(section => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${selectedSection === section.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
            >
              <Icon className="w-4 h-4" />
              {section.title}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">In This Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {docSections
                .find(s => s.id === selectedSection)
                ?.articles.map(article => (
                  <button
                    key={article.id}
                    onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="font-medium text-slate-900 text-sm">{article.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
                        {article.difficulty}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                  </button>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {filteredSections
            .filter(section => section.id === selectedSection)
            .map(section => (
              <div key={section.id} className="space-y-6">
                {section.articles.map(article => (
                  <Card key={article.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
                              {article.difficulty}
                            </span>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              {article.category}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readTime}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">{article.title}</h3>
                          <p className="text-slate-600">{article.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/app/documentation/${article.id}`)}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    {expandedArticle === article.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-200"
                      >
                        <CardContent className="p-6">
                          <div className="prose prose-slate max-w-none">
                            <h4 className="text-lg font-semibold mb-4">Overview</h4>
                            <p className="text-slate-600 mb-6">
                              This comprehensive guide covers everything you need to know about {article.title.toLowerCase()}.
                              Follow along step-by-step to master this feature and enhance your job search experience.
                            </p>

                            <h4 className="text-lg font-semibold mb-4">Key Points</h4>
                            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                              <li>Easy-to-follow instructions with real-world examples</li>
                              <li>Best practices and pro tips for optimal results</li>
                              <li>Common pitfalls and how to avoid them</li>
                              <li>Advanced techniques for power users</li>
                            </ul>

                            <h4 className="text-lg font-semibold mb-4">Step-by-Step Guide</h4>
                            <div className="space-y-4 mb-6">
                              <div className="flex gap-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                  <span className="text-sm font-bold text-blue-600">1</span>
                                </div>
                                <div>
                                  <h5 className="font-semibold text-slate-900">Getting Started</h5>
                                  <p className="text-slate-600">Begin with the basics and understand the core concepts.</p>
                                </div>
                              </div>
                              <div className="flex gap-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                  <span className="text-sm font-bold text-blue-600">2</span>
                                </div>
                                <div>
                                  <h5 className="font-semibold text-slate-900">Implementation</h5>
                                  <p className="text-slate-600">Follow the detailed steps to implement the feature correctly.</p>
                                </div>
                              </div>
                              <div className="flex gap-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                  <span className="text-sm font-bold text-blue-600">3</span>
                                </div>
                                <div>
                                  <h5 className="font-semibold text-slate-900">Optimization</h5>
                                  <p className="text-slate-600">Fine-tune your approach for maximum efficiency.</p>
                                </div>
                              </div>
                            </div>

                            <h4 className="text-lg font-semibold mb-4">Frequently Asked Questions</h4>
                            <div className="space-y-3">
                              <div className="bg-slate-50 p-4 rounded-lg">
                                <h5 className="font-semibold text-slate-900 mb-2">Q: How do I get started quickly?</h5>
                                <p className="text-slate-600">A: Follow our quick start guide for a 5-minute setup process.</p>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-lg">
                                <h5 className="font-semibold text-slate-900 mb-2">Q: What are the system requirements?</h5>
                                <p className="text-slate-600">A: ApplyFlow works on all modern browsers with no special requirements.</p>
                              </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                              <Button
                                className="flex items-center gap-2"
                                onClick={() => handleMarkAsComplete(article.id)}
                                disabled={completedArticles.has(article.id)}
                              >
                                <CheckCircle className={`w-4 h-4 ${completedArticles.has(article.id) ? 'fill-current' : ''}`} />
                                {completedArticles.has(article.id) ? 'Completed' : 'Mark as Complete'}
                              </Button>
                              <Button
                                variant="ghost"
                                className="flex items-center gap-2"
                                onClick={() => handleDownloadPDF(article)}
                              >
                                <Download className="w-4 h-4" />
                                Download PDF
                              </Button>
                              <Button
                                variant="ghost"
                                className="flex items-center gap-2"
                                onClick={() => handleShare(article)}
                              >
                                <Share2 className="w-4 h-4" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </Card>
                ))}
              </div>
            ))}
        </div>
      </div>

    </div>
  );
}
