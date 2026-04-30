import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  TrendingUp,
  Clock,
  Search,
  Plus,
  Smile,
  Paperclip,
  MoreHorizontal,
  Award,
  Target,
  Eye,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle,
  X
} from 'lucide-react';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    location: string;
    badge?: string;
  };
  content: {
    text: string;
    image?: string;
    tags: string[];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  category: string;
}

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  location: string;
  bio: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  isOnline: boolean;
  badge?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  achievements?: string[];
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      role: 'Software Engineer',
      location: 'San Francisco, CA',
      badge: 'Top Contributor'
    },
    content: {
      text: 'Just landed my dream job at Google! ApplyFlow\'s AI assistant helped me optimize my resume and prepare for interviews. The analytics dashboard showed me exactly where I needed to improve. #SuccessStory #TechJobs',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600',
      tags: ['SuccessStory', 'TechJobs', 'Google']
    },
    engagement: {
      likes: 342,
      comments: 28,
      shares: 15,
      views: 2847
    },
    timestamp: '2 hours ago',
    isLiked: false,
    isBookmarked: false,
    category: 'Success Stories'
  },
  {
    id: '2',
    author: {
      name: 'Michael Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'Product Manager',
      location: 'New York, NY',
      badge: 'Career Coach'
    },
    content: {
      text: 'Pro tip: Always follow up within 24 hours after an interview. I created a template in ApplyFlow and it increased my response rate by 60%! Who else has seen success with follow-up strategies?',
      tags: ['Tips', 'Interview', 'Strategy']
    },
    engagement: {
      likes: 189,
      comments: 42,
      shares: 23,
      views: 1523
    },
    timestamp: '4 hours ago',
    isLiked: true,
    isBookmarked: false,
    category: 'Tips & Tricks'
  },
  {
    id: '3',
    author: {
      name: 'Emily Watson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      role: 'Data Scientist',
      location: 'Seattle, WA'
    },
    content: {
      text: 'Anyone else experiencing interview fatigue? Been applying for 3 months straight with 50+ applications. The numbers game is real, but ApplyFlow helps me stay organized and motivated. Keep pushing everyone! #JobSearch #Motivation',
      tags: ['Motivation', 'JobSearch', 'Support']
    },
    engagement: {
      likes: 267,
      comments: 56,
      shares: 18,
      views: 1920
    },
    timestamp: '6 hours ago',
    isLiked: false,
    isBookmarked: true,
    category: 'Discussion'
  },
  {
    id: '4',
    author: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      role: 'Senior Developer',
      location: 'Austin, TX',
      badge: 'Industry Expert'
    },
    content: {
      text: 'Hot take: Technical interviews are broken. We spend weeks preparing for algorithms we\'ll never use, then get rejected for not having enough "system design experience". Companies need to rethink their hiring process. #TechInterview #Hiring',
      image: 'https://images.unsplash.com/photo-1517245386807-bb0f4c06b4a6?w=600',
      tags: ['TechInterview', 'Hiring', 'Opinion']
    },
    engagement: {
      likes: 523,
      comments: 89,
      shares: 34,
      views: 4210
    },
    timestamp: '8 hours ago',
    isLiked: true,
    isBookmarked: false,
    category: 'Discussion'
  },
  {
    id: '5',
    author: {
      name: 'Jessica Liu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'UX Designer',
      location: 'Portland, OR'
    },
    content: {
      text: 'Portfolio tip: Show your process, not just pretty pictures. I landed 3 interviews by including case studies that showed my research, iterations, and design decisions. Recruiters love seeing how you think! #Portfolio #DesignTips',
      tags: ['Portfolio', 'DesignTips', 'Career']
    },
    engagement: {
      likes: 156,
      comments: 23,
      shares: 12,
      views: 987
    },
    timestamp: '12 hours ago',
    isLiked: false,
    isBookmarked: true,
    category: 'Tips & Tricks'
  },
  {
    id: '6',
    author: {
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      role: 'Marketing Manager',
      location: 'Chicago, IL',
      badge: 'Mentor'
    },
    content: {
      text: 'Career transition success story: Went from retail to marketing in 6 months! Key was building a portfolio of freelance projects and networking like crazy. ApplyFlow kept me organized throughout the journey. #CareerChange #Success',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
      tags: ['CareerChange', 'Success', 'Marketing']
    },
    engagement: {
      likes: 412,
      comments: 67,
      shares: 28,
      views: 3456
    },
    timestamp: '1 day ago',
    isLiked: true,
    isBookmarked: false,
    category: 'Success Stories'
  }
];

const mockMembers: CommunityMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    role: 'Software Engineer',
    location: 'San Francisco, CA',
    bio: 'Tech enthusiast | Coffee lover | Always learning | 5+ years in Silicon Valley',
    stats: { posts: 42, followers: 1234, following: 89 },
    isOnline: true,
    badge: 'Top Contributor',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    experience: '5 years',
    education: 'Stanford University - Computer Science',
    achievements: ['Google SWE Offer', 'Open Source Contributor', 'Tech Speaker']
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'Product Manager',
    location: 'New York, NY',
    bio: 'Building products that matter | Career coach | Helping 100+ job seekers land their dream roles',
    stats: { posts: 28, followers: 892, following: 156 },
    isOnline: true,
    badge: 'Career Coach',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis'],
    experience: '7 years',
    education: 'Harvard Business School - MBA',
    achievements: ['Career Coach Certified', 'Product Launch Expert', 'Mentor of the Year']
  },
  {
    id: '3',
    name: 'Emily Watson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'Data Scientist',
    location: 'Seattle, WA',
    bio: 'Data-driven decisions | Machine learning enthusiast | Turning data into insights',
    stats: { posts: 35, followers: 756, following: 234 },
    isOnline: false,
    skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
    experience: '4 years',
    education: 'MIT - Data Science',
    achievements: ['Kaggle Competition Winner', 'Published Research Papers', 'AI Conference Speaker']
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'Senior Developer',
    location: 'Austin, TX',
    bio: 'Full-stack developer | Open source contributor | Building the future of web',
    stats: { posts: 19, followers: 445, following: 178 },
    isOnline: true,
    badge: 'Industry Expert',
    skills: ['JavaScript', 'React', 'Node.js', 'Docker'],
    experience: '6 years',
    education: 'UT Austin - Computer Engineering',
    achievements: ['GitHub Star Developer', 'Tech Lead', 'Conference Speaker']
  },
  {
    id: '5',
    name: 'Jessica Liu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'UX Designer',
    location: 'Portland, OR',
    bio: 'Designing user experiences that matter | Human-centered design advocate',
    stats: { posts: 31, followers: 623, following: 145 },
    isOnline: true,
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    experience: '3 years',
    education: 'RISD - Industrial Design',
    achievements: ['Design Award Winner', 'UX Conference Speaker', 'Design System Creator']
  },
  {
    id: '6',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'Marketing Manager',
    location: 'Chicago, IL',
    bio: 'Marketing strategist | Career transition expert | Helping professionals pivot successfully',
    stats: { posts: 24, followers: 567, following: 198 },
    isOnline: false,
    badge: 'Mentor',
    skills: ['Digital Marketing', 'Content Strategy', 'SEO', 'Analytics'],
    experience: '8 years',
    education: 'Northwestern - Marketing',
    achievements: ['Marketing Campaign Award', 'Career Coach Certified', 'Published Author']
  }
];

const categories = ['All', 'Success Stories', 'Tips & Tricks', 'Discussion', 'Resources', 'Questions'];

export default function Community() {
  const [posts, setPosts] = useState(mockPosts);
  const [members, setMembers] = useState(mockMembers);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPost, setNewPost] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'trending'>('feed');
  const [animatedStats, setAnimatedStats] = useState({
    totalPosts: 1247,
    activeUsers: 8934,
    successStories: 342,
    avgResponseTime: 2.3
  });

  // Dynamic stats animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        totalPosts: Math.max(1000, prev.totalPosts + Math.floor((Math.random() - 0.5) * 10)),
        activeUsers: Math.max(8000, prev.activeUsers + Math.floor((Math.random() - 0.5) * 20)),
        successStories: Math.max(300, prev.successStories + Math.floor((Math.random() - 0.5) * 5)),
        avgResponseTime: Math.max(1.5, Math.min(5, prev.avgResponseTime + (Math.random() - 0.5) * 0.2))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic member online status
  useEffect(() => {
    const interval = setInterval(() => {
      setMembers(prev => prev.map(member => ({
        ...member,
        isOnline: Math.random() > 0.3
      })));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic engagement updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts(prev => prev.map(post => ({
        ...post,
        engagement: {
          ...post.engagement,
          views: post.engagement.views + Math.floor(Math.random() * 5),
          likes: Math.random() > 0.7 ? post.engagement.likes + 1 : post.engagement.likes,
          comments: Math.random() > 0.8 ? post.engagement.comments + 1 : post.engagement.comments,
          shares: Math.random() > 0.9 ? post.engagement.shares + 1 : post.engagement.shares
        }
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleComment = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          engagement: {
            ...post.engagement,
            comments: post.engagement.comments + 1
          }
        };
      }
      return post;
    }));
  };

  const handleShare = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          engagement: {
            ...post.engagement,
            shares: post.engagement.shares + 1
          }
        };
      }
      return post;
    }));
  };

  const handleMemberClick = (memberData: CommunityMember | { name: string; avatar: string; role: string; location: string; badge?: string }) => {
    // Find full member data if available, otherwise use the provided data
    const fullMember = 'id' in memberData ? memberData : members.find(m => m.name === memberData.name);
    setSelectedMember(fullMember || memberData as CommunityMember);
    setShowMemberModal(true);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.content.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          engagement: {
            ...post.engagement,
            likes: post.isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1
          }
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post: CommunityPost = {
        id: Date.now().toString(),
        author: {
          name: 'You',
          avatar: 'YU',
          role: 'Job Seeker',
          location: 'Your City'
        },
        content: {
          text: newPost,
          tags: []
        },
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        timestamp: 'Just now',
        isLiked: false,
        isBookmarked: false,
        category: 'Discussion'
      };
      setPosts(prev => [post, ...prev]);
      setNewPost('');
      setShowPostModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full"
        >
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">Community Hub</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-slate-900">Join the Conversation</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Connect with fellow job seekers, share experiences, and get support from our vibrant community of professionals.
        </p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Community Posts', value: animatedStats.totalPosts, icon: MessageCircle, color: 'text-blue-600' },
          { label: 'Active Members', value: animatedStats.activeUsers, icon: Users, color: 'text-green-600' },
          { label: 'Success Stories', value: animatedStats.successStories, icon: Award, color: 'text-purple-600' },
          { label: 'Avg Response Time', value: `${animatedStats.avgResponseTime.toFixed(1)}h`, icon: Clock, color: 'text-orange-600' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
                <CardContent className="p-6">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <motion.div
                    key={stat.value}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold text-slate-900"
                  >
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </motion.div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {[
          { id: 'feed', label: 'Feed', icon: MessageCircle },
          { id: 'members', label: 'Members', icon: Users },
          { id: 'trending', label: 'Trending', icon: TrendingUp }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'feed' | 'members' | 'trending')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search posts, members, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed/Members/Trending Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'feed' && (
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      {/* Author */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleMemberClick(post.author)}
                            className="w-12 h-12 rounded-full overflow-hidden cursor-pointer ring-2 ring-white shadow-lg"
                          >
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3
                                className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => handleMemberClick(post.author)}
                              >
                                {post.author.name}
                              </h3>
                              {post.author.badge && (
                                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full">
                                  {post.author.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <span>{post.author.role}</span>
                              <span>·</span>
                              <span>{post.author.location}</span>
                              <span>·</span>
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="mb-4">
                        <p className="text-slate-700 mb-3">{post.content.text}</p>
                        {post.content.image && (
                          <motion.img
                            whileHover={{ scale: 1.02 }}
                            src={post.content.image}
                            alt="Post image"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        )}
                        {post.content.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.content.tags.map(tag => (
                              <span
                                key={tag}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Engagement */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-2 transition-colors ${post.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                              }`}
                          >
                            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm">{post.engagement.likes}</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleComment(post.id)}
                            className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm">{post.engagement.comments}</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleShare(post.id)}
                            className="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-colors"
                          >
                            <Share2 className="w-5 h-5" />
                            <span className="text-sm">{post.engagement.shares}</span>
                          </motion.button>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleBookmark(post.id)}
                            className={`transition-colors ${post.isBookmarked ? 'text-blue-500' : 'text-slate-500 hover:text-blue-500'
                              }`}
                          >
                            <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                          </motion.button>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{post.engagement.views}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {activeTab === 'members' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => handleMemberClick(member)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white shadow-lg">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <motion.div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${member.isOnline ? 'bg-green-500' : 'bg-slate-300'
                              }`}
                            animate={{ scale: member.isOnline ? [1, 1.2, 1] : 1 }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{member.name}</h3>
                            {member.badge && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-1 rounded">PRO</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{member.role}</p>
                          <p className="text-xs text-slate-500">{member.location}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{member.bio}</p>
                      <div className="flex justify-between text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">{member.stats.posts}</div>
                          <div className="text-slate-500">Posts</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">{member.stats.followers.toLocaleString()}</div>
                          <div className="text-slate-500">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{member.stats.following}</div>
                          <div className="text-slate-500">Following</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'trending' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold text-slate-900">Trending Posts</h2>
              </div>
              {posts
                .sort((a, b) => (b.engagement.likes + b.engagement.comments + b.engagement.shares) - (a.engagement.likes + a.engagement.comments + a.engagement.shares))
                .map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        {/* Trending Badge */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1 text-red-500">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">Trending #{index + 1}</span>
                          </div>
                          <span className="text-xs text-slate-500">{post.timestamp}</span>
                        </div>

                        {/* Author */}
                        <div className="flex items-center gap-3 mb-4">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleMemberClick(post.author)}
                            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-white shadow-lg"
                          >
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                          <div>
                            <h3
                              className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => handleMemberClick(post.author)}
                            >
                              {post.author.name}
                            </h3>
                            <p className="text-sm text-slate-500">{post.author.role}</p>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                          <p className="text-slate-700 mb-3 line-clamp-3">{post.content.text}</p>
                          {post.content.image && (
                            <motion.img
                              whileHover={{ scale: 1.02 }}
                              src={post.content.image}
                              alt="Post image"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          )}
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-red-500">
                              <Heart className="w-4 h-4 fill-current" />
                              <span className="text-sm font-medium">{post.engagement.likes}</span>
                            </div>
                            <div className="flex items-center gap-1 text-blue-500">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">{post.engagement.comments}</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-500">
                              <Share2 className="w-4 h-4" />
                              <span className="text-sm font-medium">{post.engagement.shares}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{post.engagement.views}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Active Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {members.map(member => (
                <motion.div
                  key={member.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleMemberClick(member)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <motion.div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${member.isOnline ? 'bg-green-500' : 'bg-slate-300'
                        }`}
                      animate={{ scale: member.isOnline ? [1, 1.2, 1] : 1 }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 truncate">{member.name}</h4>
                      {member.badge && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-1 rounded">PRO</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { topic: '#SuccessStories', posts: 234 },
                { topic: '#InterviewTips', posts: 189 },
                { topic: '#ResumeHelp', posts: 156 },
                { topic: '#TechJobs', posts: 142 },
                { topic: '#CareerAdvice', posts: 98 }
              ].map((trend, index) => (
                <motion.div
                  key={trend.topic}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <span className="text-sm font-medium text-blue-600">{trend.topic}</span>
                  <span className="text-xs text-slate-500">{trend.posts} posts</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Community Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Be respectful and supportive</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Share valuable insights and experiences</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Help others in their job search journey</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Keep conversations professional</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Member Profile Modal */}
      <AnimatePresence>
        {showMemberModal && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowMemberModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card>
                <CardContent className="p-6">
                  {/* Profile Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                          <img
                            src={selectedMember.avatar}
                            alt={selectedMember.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <motion.div
                          className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white ${selectedMember.isOnline ? 'bg-green-500' : 'bg-slate-300'
                            }`}
                          animate={{ scale: selectedMember.isOnline ? [1, 1.2, 1] : 1 }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl font-bold text-slate-900">{selectedMember.name}</h2>
                          {selectedMember.badge && (
                            <span className="text-sm bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full">
                              {selectedMember.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 font-medium">{selectedMember.role}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {selectedMember.location}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowMemberModal(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-2">About</h3>
                    <p className="text-slate-600">{selectedMember.bio}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedMember.stats.posts}</div>
                      <div className="text-sm text-blue-600">Posts</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedMember.stats.followers.toLocaleString()}</div>
                      <div className="text-sm text-purple-600">Followers</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedMember.stats.following}</div>
                      <div className="text-sm text-green-600">Following</div>
                    </div>
                  </div>

                  {/* Experience & Education */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {selectedMember.experience && (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="w-4 h-4 text-slate-600" />
                          <h4 className="font-semibold text-slate-900">Experience</h4>
                        </div>
                        <p className="text-slate-600">{selectedMember.experience}</p>
                      </div>
                    )}
                    {selectedMember.education && (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="w-4 h-4 text-slate-600" />
                          <h4 className="font-semibold text-slate-900">Education</h4>
                        </div>
                        <p className="text-slate-600">{selectedMember.education}</p>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {selectedMember.skills && selectedMember.skills.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-slate-900 mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.skills.map(skill => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-slate-900 mb-2">Achievements</h3>
                      <div className="space-y-2">
                        {selectedMember.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2 text-slate-600">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Follow
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Create a Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your thoughts, experiences, or ask for advice..."
                    className="w-full h-32 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setShowPostModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                        Post
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
