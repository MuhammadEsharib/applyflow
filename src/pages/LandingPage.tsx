import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Quote, ChevronLeft, ChevronRight, TrendingUp, Award, Activity, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../features';

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginAsAdmin } = useAuthStore();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentChart, setCurrentChart] = useState(0);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [adminError, setAdminError] = useState('');
  const [pipelineData, setPipelineData] = useState([
    { status: 'Wishlist', value: 30, color: 'bg-blue-300' },
    { status: 'Applied', value: 45, color: 'bg-blue-400' },
    { status: 'Interview', value: 60, color: 'bg-blue-500' },
    { status: 'Offer', value: 25, color: 'bg-blue-600' }
  ]);
  const [stats, setStats] = useState({
    totalApplications: 156,
    applicationsGrowth: 12,
    interviews: 24,
    interviewsThisWeek: 3,
    successRate: 67
  });

  const [recentActivity, setRecentActivity] = useState([
    { action: 'Applied to', company: 'Google', time: '2h ago' },
    { action: 'Interview with', company: 'Meta', time: '5h ago' },
    { action: 'Offer from', company: 'Amazon', time: '1d ago' }
  ]);

  // Dynamic pipeline data changes
  useEffect(() => {
    const interval = setInterval(() => {
      setPipelineData(prev => prev.map(item => ({
        ...item,
        value: Math.max(10, Math.min(80, item.value + (Math.random() - 0.5) * 10))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic stats changes (4-8 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalApplications: Math.max(100, Math.min(300, prev.totalApplications + Math.floor((Math.random() - 0.5) * 20))),
        applicationsGrowth: Math.max(5, Math.min(25, prev.applicationsGrowth + Math.floor((Math.random() - 0.5) * 5))),
        interviews: Math.max(15, Math.min(50, prev.interviews + Math.floor((Math.random() - 0.5) * 5))),
        interviewsThisWeek: Math.max(1, Math.min(8, prev.interviewsThisWeek + Math.floor((Math.random() - 0.5) * 2))),
        successRate: Math.max(50, Math.min(85, prev.successRate + (Math.random() - 0.5) * 5))
      }));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic recent activity changes
  useEffect(() => {
    const activities = [
      { action: 'Applied to', company: 'Google', time: '2h ago' },
      { action: 'Interview with', company: 'Meta', time: '5h ago' },
      { action: 'Offer from', company: 'Amazon', time: '1d ago' },
      { action: 'Applied to', company: 'Microsoft', time: '3h ago' },
      { action: 'Interview with', company: 'Apple', time: '6h ago' },
      { action: 'Rejected by', company: 'Netflix', time: '4h ago' },
      { action: 'Applied to', company: 'Tesla', time: '1h ago' },
      { action: 'Offer from', company: 'Spotify', time: '2d ago' }
    ];

    const interval = setInterval(() => {
      // Randomly select 3 activities from the pool
      const shuffled = [...activities].sort(() => Math.random() - 0.5);
      setRecentActivity(shuffled.slice(0, 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Hidden admin login: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdminLogin(!showAdminLogin);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAdminLogin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAsAdmin(adminCredentials.username, adminCredentials.password);
    if (success) {
      navigate('/app/admin');
    } else {
      setAdminError('Invalid credentials');
    }
  };


  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      company: 'Google',
      rating: 5,
      text: 'ApplyFlow transformed my job search. I went from 0 offers to 3 in just 2 months. The analytics helped me understand what was working.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager',
      company: 'Meta',
      rating: 5,
      text: 'The tracking features are incredible. I never missed a deadline or follow-up. Highly recommend for anyone serious about their career.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Emily Watson',
      role: 'Data Scientist',
      company: 'Amazon',
      rating: 5,
      text: 'Simple, powerful, and beautiful. ApplyFlow made organizing my job applications effortless. The insights were game-changing.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'David Kim',
      role: 'Senior Developer',
      company: 'Microsoft',
      rating: 5,
      text: 'The best job application tracker I\'ve used. The interface is clean, intuitive, and the features are exactly what I needed.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    }
  ];

  const ratings = [
    {
      platform: 'Product Hunt',
      rating: 4.9,
      reviews: 1247,
      color: '#FF6154'
    },
    {
      platform: 'G2',
      rating: 4.8,
      reviews: 892,
      color: '#FF4284'
    },
    {
      platform: 'Capterra',
      rating: 4.7,
      reviews: 654,
      color: '#00A3E0'
    },
    {
      platform: 'Trustpilot',
      rating: 4.9,
      reviews: 2103,
      color: '#00B67A'
    }
  ];

  const charts = [
    {
      title: 'Application Success Rate',
      type: 'line',
      data: [12, 19, 25, 32, 45, 58, 72],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      description: 'Track your interview success over time'
    },
    {
      title: 'Response Time Analysis',
      type: 'bar',
      data: [3, 5, 8, 12, 15, 18, 22],
      labels: ['Tech', 'Finance', 'Healthcare', 'Retail', 'Education', 'Gov', 'Other'],
      description: 'Average response time by industry (days)'
    },
    {
      title: 'Application Distribution',
      type: 'pie',
      data: [35, 25, 20, 15, 5],
      labels: ['Applied', 'Interview', 'Offer', 'Rejected', 'Wishlist'],
      description: 'Current status of all applications'
    }
  ];

  const discussions = [
    {
      user: 'Alex Thompson',
      avatar: 'AT',
      topic: 'Best practices for following up?',
      replies: 24,
      views: 156,
      time: '2h ago'
    },
    {
      user: 'Jessica Lee',
      avatar: 'JL',
      topic: 'How to handle multiple offers?',
      replies: 18,
      views: 234,
      time: '5h ago'
    },
    {
      user: 'Marcus Johnson',
      avatar: 'MJ',
      topic: 'Resume tips for tech roles',
      replies: 31,
      views: 412,
      time: '1d ago'
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowAdminLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black">Admin Access</h3>
                  <p className="text-sm text-black/60">Enter your credentials</p>
                </div>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Username</label>
                  <input
                    type="text"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                    placeholder="Enter username"
                    autoFocus
                    className="w-full px-4 py-2 rounded-xl border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Password</label>
                  <input
                    type="password"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full px-4 py-2 rounded-xl border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                {adminError && (
                  <p className="text-red-500 text-sm">{adminError}</p>
                )}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAdminLogin(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Login
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Organic Mesh Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-blue-50/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-50 bg-white border-b border-border"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-600">ApplyFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/onboarding')}
                className="text-blue-600 hover:bg-blue-50 font-medium"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/onboarding')}
                className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 rounded-full px-6 shadow-lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.div
          className="max-w-5xl mx-auto text-center py-20 md:py-32 px-6"
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-black mb-8 leading-tight tracking-tight"
          >
            Your job search,<br />
            <span className="text-blue-600">refined</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-black/70 mb-12 font-light leading-relaxed"
          >
            A sophisticated approach to tracking applications. Organize your journey with clarity, insight, and elegance.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate('/onboarding')}
              className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 rounded-full px-8 shadow-lg"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/onboarding')}
              className="rounded-full px-8 bg-white border border-border shadow-lg"
            >
              View Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Dashboard Preview */}
        <motion.div
          className="max-w-6xl mx-auto mb-24 px-6"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-[40px] overflow-hidden bg-white border border-border shadow-2xl"
          >
            <div className="relative p-8 md:p-12">
              {/* Mock Dashboard UI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-black mb-4">Application Pipeline</h3>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                        <div className="w-3 h-3 rounded-full bg-blue-300" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {pipelineData.map((item, i) => (
                        <div key={item.status} className="flex items-center gap-3">
                          <div className="w-32 h-8 rounded-lg bg-black/4 flex items-center px-3 text-xs text-black/60">{item.status}</div>
                          <div className="flex-1 h-8 rounded-lg bg-black/4 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeInOut' }}
                              className={`h-full ${item.color} rounded-lg`}
                            />
                          </div>
                          <motion.span
                            key={item.value}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-black/60 w-8 text-right"
                          >
                            {Math.round(item.value)}
                          </motion.span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-6 border border-border">
                      <motion.div
                        key={stats.totalApplications}
                        initial={{ scale: 0.95, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="text-3xl font-bold text-black mb-1">{stats.totalApplications}</div>
                        <div className="text-sm text-black/70">Total Applications</div>
                        <div className="mt-3 flex items-center gap-1 text-blue-600 text-sm">
                          <TrendingUp className="w-4 h-4" />
                          <span>+{stats.applicationsGrowth}% this month</span>
                        </div>
                      </motion.div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-border">
                      <motion.div
                        key={stats.interviews}
                        initial={{ scale: 0.95, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <div className="text-3xl font-bold text-black mb-1">{stats.interviews}</div>
                        <div className="text-sm text-black/70">Interviews Scheduled</div>
                        <div className="mt-3 flex items-center gap-1 text-blue-600 text-sm">
                          <Activity className="w-4 h-4" />
                          <span>{stats.interviewsThisWeek} this week</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-border">
                    <h3 className="font-semibold text-black mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((item, i) => (
                        <motion.div
                          key={`${item.company}-${i}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-black">{item.action} <span className="font-semibold">{item.company}</span></p>
                            <p className="text-xs text-black/60">{item.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                    <motion.div
                      key={stats.successRate}
                      initial={{ scale: 0.95, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h3 className="font-semibold mb-2">Success Rate</h3>
                      <div className="text-4xl font-bold mb-1">{Math.round(stats.successRate)}%</div>
                      <p className="text-sm opacity-80">Above industry average</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trusted By Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-24 px-6"
        >
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-5xl md:text-6xl lg:text-7xl font-extrabold text-black mb-16 tracking-tight"
          >
            Trusted by professionals at
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              { name: 'Google', image: '/icons8-google-logo-48.png' },
              { name: 'Meta', image: '/meta_PNG5.png' },
              { name: 'Amazon', image: '/amazon.jpg' },
              { name: 'Microsoft', image: '/Microsoft.png' },
              { name: 'Apple', image: '/apple.png' },
              { name: 'Netflix', image: '/netflix.png' }
            ].map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center gap-2 cursor-default select-none"
              >
                <img
                  src={company.image}
                  alt={company.name}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-sm font-medium text-black/60">{company.name}</span>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-8 mt-12"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <div className="text-sm text-black/60">Users</div>
            </div>
            <div className="w-px bg-black/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">100+</div>
              <div className="text-sm text-black/60">Countries</div>
            </div>
            <div className="w-px bg-black/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4.9★</div>
              <div className="text-sm text-black/60">Rating</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-24 px-6"
        >
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-[#1F2937] text-center mb-16"
          >
            Loved by professionals
          </motion.h2>
          <div className="relative">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                currentTestimonial === index && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-[40px] p-8 md:p-12 border border-[#E5E7EB] shadow-2xl"
                  >
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-shrink-0">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-20 h-20 rounded-3xl object-cover shadow-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-blue-500 text-blue-500" />
                          ))}
                        </div>
                        <Quote className="w-10 h-10 text-blue-200 mb-4" />
                        <p className="text-xl text-black mb-6 leading-relaxed font-light">{testimonial.text}</p>
                        <div>
                          <p className="font-semibold text-black">{testimonial.name}</p>
                          <p className="text-sm text-black/70">{testimonial.role} at {testimonial.company}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${currentTestimonial === index ? 'bg-blue-500 w-8' : 'bg-black/20'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Ratings Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-24 px-6"
        >
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-[#1F2937] text-center mb-16"
          >
            Trusted across platforms
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ratings.map((rating, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-border shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-6 h-6" style={{ color: rating.color }} />
                  <span className="font-semibold text-black">{rating.platform}</span>
                </div>
                <div className="text-4xl font-bold text-black mb-2">{rating.rating}</div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />
                  ))}
                </div>
                <p className="text-sm text-black/70">{rating.reviews} reviews</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Advanced Charts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-24 px-6"
        >
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-black mb-4"
          >
            Analytics at a glance
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-black/70 mb-12"
          >
            Track your progress with real-time insights and data visualizations
          </motion.p>
          <div className="relative">
            <AnimatePresence mode="wait">
              {charts.map((chart, index) => (
                currentChart === index && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-[40px] p-8 md:p-12 border border-border shadow-2xl"
                  >
                    <h3 className="text-2xl font-serif text-black mb-2">{chart.title}</h3>
                    <p className="text-black/70 mb-8">{chart.description}</p>

                    {/* Line Chart */}
                    {chart.type === 'line' && (
                      <div className="h-64 relative">
                        <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <motion.path
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 1.5 }}
                            d={`M 0 ${200 - (chart.data[0] / Math.max(...chart.data)) * 180} ${chart.data.map((val, i) => `L ${i * 60 + 20} ${200 - (val / Math.max(...chart.data)) * 180}`).join(' ')}`}
                            fill="url(#lineGradient)"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {chart.data.map((value, i) => (
                            <motion.circle
                              key={i}
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              transition={{ delay: i * 0.1, duration: 0.3 }}
                              cx={i * 60 + 20}
                              cy={200 - (value / Math.max(...chart.data)) * 180}
                              r="6"
                              fill="#3B82F6"
                              className="group"
                            >
                              <title>{value}</title>
                            </motion.circle>
                          ))}
                        </svg>
                        <div className="flex justify-around mt-2">
                          {chart.labels.map((label, i) => (
                            <span key={i} className="text-sm text-black/70">{label}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bar Chart */}
                    {chart.type === 'bar' && (
                      <div className="h-64 flex items-end justify-around gap-4">
                        {chart.data.map((value, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${(value / Math.max(...chart.data)) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="h-full w-12 rounded-t-2xl relative group bg-gradient-to-t from-black to-black/60"
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {value} days
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Pie Chart */}
                    {chart.type === 'pie' && (
                      <div className="h-64 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-48 h-48">
                          {chart.data.map((value, i) => {
                            const total = chart.data.reduce((sum, v) => sum + v, 0);
                            const percentage = (value / total) * 100;
                            const previousValues = chart.data.slice(0, i);
                            const previousTotal = previousValues.reduce((sum, v) => sum + v, 0);
                            const startAngle = (previousTotal / total) * 360;
                            const endAngle = startAngle + (percentage / 100) * 360;

                            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                            const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                            const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                            const largeArcFlag = percentage > 50 ? 1 : 0;

                            const colors = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

                            return (
                              <motion.path
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                fill={colors[i % colors.length]}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                              >
                                <title>{chart.labels[i]}: {value}%</title>
                              </motion.path>
                            );
                          })}
                        </svg>
                      </div>
                    )}

                    {chart.type !== 'pie' && (
                      <div className="flex justify-around mt-4">
                        {chart.labels.map((label, i) => (
                          <span key={i} className="text-sm text-black/70">{label}</span>
                        ))}
                      </div>
                    )}

                    {chart.type === 'pie' && (
                      <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {chart.labels.map((label, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'][i % 5] }}
                            />
                            <span className="text-sm text-black/70">{label}: {chart.data[i]}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setCurrentChart((prev) => (prev - 1 + charts.length) % charts.length)}
                className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-3">
                {charts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChart(index)}
                    className={`w-3 h-3 rounded-full transition-all ${currentChart === index ? 'bg-blue-500 w-8' : 'bg-black/20'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentChart((prev) => (prev + 1) % charts.length)}
                className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* User Discussions Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-24 px-6"
        >
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-black mb-4"
          >
            Community discussions
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-black/70 mb-12"
          >
            Join conversations with job seekers worldwide
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {discussions.map((discussion, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-border shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white text-sm font-bold">
                    {discussion.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-black">{discussion.user}</p>
                    <p className="text-xs text-black/60">{discussion.time}</p>
                  </div>
                </div>
                <p className="font-semibold text-black mb-2">{discussion.topic}</p>
                <p className="text-sm text-black/70 line-clamp-2">{discussion.topic}</p>
                <div className="flex items-center gap-4 text-xs text-black/60 mt-4">
                  <span>{discussion.replies} replies</span>
                  <span>{discussion.views} views</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Overall Impressions Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24 px-6"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[40px] p-8 md:p-12 text-white shadow-2xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10K+', label: 'Active Users' },
                { value: '50K+', label: 'Applications Tracked' },
                { value: '4.9', label: 'Average Rating' },
                { value: '98%', label: 'Satisfaction Rate' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24 px-6 text-center"
        >
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-serif text-black mb-4"
          >
            Ready to refine your job search?
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-black/70 mb-12 max-w-2xl mx-auto"
          >
            Join thousands of professionals who have transformed their career journey with ApplyFlow.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/onboarding')}
              className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 rounded-full px-8 shadow-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Hidden Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAdminLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black">Admin Access</h3>
                  <p className="text-sm text-black/60">Enter your credentials</p>
                </div>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Username</label>
                  <input
                    type="text"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter username"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Password</label>
                  <input
                    type="password"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter password"
                  />
                </div>
                {adminError && (
                  <p className="text-red-500 text-sm">{adminError}</p>
                )}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAdminLogin(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Login
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
