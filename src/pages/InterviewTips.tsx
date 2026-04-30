import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Video,
  Search,
  Lightbulb,
  MessageCircle,
  Users,
  Star,
  Clock,
  Target,
  Code,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Brain,
  Eye,
  CheckCircle,
  Mic,
  Hand
} from 'lucide-react';

interface InterviewTip {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'preparation' | 'during' | 'follow-up' | 'common';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  rating: number;
  views: number;
  keyPoints: string[];
  tags: string[];
  isVideo?: boolean;
  isInteractive?: boolean;
}

const tips: InterviewTip[] = [
  {
    id: '1',
    title: 'The STAR Method: Answering Behavioral Questions',
    description: 'Master the STAR technique to structure your interview answers effectively and impress hiring managers.',
    category: 'Behavioral',
    type: 'during',
    difficulty: 'Beginner',
    readTime: '8 min',
    rating: 4.9,
    views: 15420,
    keyPoints: [
      'Situation: Set the context and background',
      'Task: Describe your responsibility and goal',
      'Action: Explain the specific steps you took',
      'Result: Share the outcome and impact'
    ],
    tags: ['STAR Method', 'Behavioral', 'Storytelling'],
    isInteractive: true
  },
  {
    id: '2',
    title: 'Technical Interview Preparation Guide',
    description: 'Comprehensive guide to preparing for technical interviews, including coding challenges and system design.',
    category: 'Technical',
    type: 'preparation',
    difficulty: 'Advanced',
    readTime: '15 min',
    rating: 4.8,
    views: 12350,
    keyPoints: [
      'Practice coding problems daily',
      'Understand data structures and algorithms',
      'Learn system design patterns',
      'Mock interviews with peers'
    ],
    tags: ['Technical', 'Coding', 'System Design'],
    isVideo: true
  },
  {
    id: '3',
    title: 'Body Language and Non-Verbal Communication',
    description: 'Learn how to project confidence through body language and make a positive first impression.',
    category: 'Soft Skills',
    type: 'during',
    difficulty: 'Intermediate',
    readTime: '6 min',
    rating: 4.7,
    views: 8934,
    keyPoints: [
      'Maintain good eye contact',
      'Use confident posture and gestures',
      'Mirror the interviewer\'s energy',
      'Avoid nervous habits'
    ],
    tags: ['Body Language', 'Communication', 'Confidence']
  },
  {
    id: '4',
    title: 'Researching the Company Before Your Interview',
    description: 'How to effectively research companies and prepare insightful questions that show your interest.',
    category: 'Preparation',
    type: 'preparation',
    difficulty: 'Beginner',
    readTime: '10 min',
    rating: 4.8,
    views: 18765,
    keyPoints: [
      'Study the company mission and values',
      'Research recent news and achievements',
      'Understand the role and team structure',
      'Prepare thoughtful questions'
    ],
    tags: ['Research', 'Company', 'Preparation']
  },
  {
    id: '5',
    title: 'Salary Negotiation Techniques',
    description: 'Strategies for negotiating salary and benefits effectively during the interview process.',
    category: 'Negotiation',
    type: 'follow-up',
    difficulty: 'Advanced',
    readTime: '12 min',
    rating: 4.9,
    views: 22156,
    keyPoints: [
      'Research market rates for your role',
      'Know your worth and walk-away point',
      'Practice your negotiation script',
      'Consider total compensation package'
    ],
    tags: ['Salary', 'Negotiation', 'Benefits'],
    isVideo: true
  },
  {
    id: '6',
    title: 'Common Interview Mistakes to Avoid',
    description: 'Learn the most common interview mistakes and how to avoid them to increase your chances of success.',
    category: 'Common Pitfalls',
    type: 'common',
    difficulty: 'Beginner',
    readTime: '7 min',
    rating: 4.6,
    views: 9876,
    keyPoints: [
      'Arriving late or unprepared',
      'Speaking negatively about past employers',
      'Not having questions for the interviewer',
      'Failing to follow up appropriately'
    ],
    tags: ['Mistakes', 'Pitfalls', 'Best Practices']
  }
];

const categories = ['All', 'Behavioral', 'Technical', 'Soft Skills', 'Preparation', 'Negotiation', 'Common Pitfalls'];
const types = ['All', 'preparation', 'during', 'follow-up', 'common'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function InterviewTips() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const filteredTips = tips
    .filter(tip => {
      const matchesCategory = selectedCategory === 'All' || tip.category === selectedCategory;
      const matchesType = selectedType === 'All' || tip.type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'All' || tip.difficulty === selectedDifficulty;
      const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesType && matchesDifficulty && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return 0; // In real app, would sort by creation date
        default:
          return 0;
      }
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'preparation': return 'bg-blue-100 text-blue-700';
      case 'during': return 'bg-purple-100 text-purple-700';
      case 'follow-up': return 'bg-orange-100 text-orange-700';
      case 'common': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Behavioral': return MessageCircle;
      case 'Technical': return Code;
      case 'Soft Skills': return Users;
      case 'Preparation': return BookOpen;
      case 'Negotiation': return TrendingUp;
      case 'Common Pitfalls': return AlertCircle;
      default: return Lightbulb;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full"
        >
          <Video className="w-4 h-4" />
          <span className="text-sm font-medium">Interview Excellence</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-slate-900">Interview Tips & Guidance</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Master your interviews with expert tips, proven strategies, and comprehensive guides covering every aspect of the interview process.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">100+</div>
            <div className="text-sm text-slate-600">Expert Tips</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-sm text-slate-600">Success Rate</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">4.8</div>
            <div className="text-sm text-slate-600">Avg Rating</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">50K+</div>
            <div className="text-sm text-slate-600">Success Stories</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search interview tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'popular' | 'rating' | 'newest')}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTips.map((tip, index) => {
          const CategoryIcon = getCategoryIcon(tip.category);
          return (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{tip.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{tip.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {tip.isVideo && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                          <Video className="w-3 h-3 inline mr-1" />
                          Video
                        </span>
                      )}
                      {tip.isInteractive && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                          <Brain className="w-3 h-3 inline mr-1" />
                          Interactive
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(tip.type)}`}>
                      {tip.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(tip.difficulty)}`}>
                      {tip.difficulty}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>{tip.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Eye className="w-3 h-3" />
                      <span>{tip.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{tip.readTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {tip.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {expandedTip === tip.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-200 pt-4 space-y-3"
                    >
                      <h4 className="font-semibold text-slate-900">Key Points:</h4>
                      <ul className="space-y-2">
                        {tip.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          {tip.isVideo ? (
                            <>
                              <Video className="w-4 h-4 mr-1" />
                              Watch Video
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-4 h-4 mr-1" />
                              Read Full Guide
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Target className="w-4 h-4 mr-1" />
                          Practice
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    variant="ghost"
                    onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                    className="w-full"
                  >
                    {expandedTip === tip.id ? 'Show Less' : 'Show More'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Quick Interview Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Phone Interviews
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Test your technology beforehand</li>
                <li>Find a quiet, professional space</li>
                <li>Speak clearly and concisely</li>
                <li>Have your resume ready</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video Interviews
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Check camera angle and lighting</li>
                <li>Maintain eye contact with camera</li>
                <li>Dress professionally from waist up</li>
                <li>Minimize distractions</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Hand className="w-4 h-4" />
                In-Person Interviews
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Arrive 10-15 minutes early</li>
                <li>Bring extra copies of resume</li>
                <li>Offer a firm handshake</li>
                <li>Send thank-you note within 24hrs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
