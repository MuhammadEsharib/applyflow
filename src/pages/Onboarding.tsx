import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Mail, User, Sparkles, Code, Briefcase, GraduationCap, Users, Palette, FlaskConical, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuthStore } from '../features';
import { useGuestStore, type DemoProfile } from '../store/modules/guestStore';
import { useNavigate } from 'react-router-dom';
import { slideUp, motionConfig } from '../lib/motion';
import { supabase } from '../lib/supabase';

type Step = 'welcome' | 'login' | 'profile' | 'admin' | 'complete';

export default function Onboarding() {
  const [step, setStep] = useState<Step>('welcome');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<DemoProfile | null>(null);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [adminError, setAdminError] = useState('');
  const navigate = useNavigate();
  const { loginAsGuest, login, loginAsAdmin } = useAuthStore();
  const { enableGuestMode, loadDemoData } = useGuestStore();

  const handleGuestMode = () => {
    setStep('profile');
  };

  const handleProfileSelect = (profile: DemoProfile) => {
    setSelectedProfile(profile);
    enableGuestMode();
    loginAsGuest();
    loadDemoData(profile);
    setStep('complete');
  };

  const handleLogin = async () => {
    if (!email || !password || !name) {
      setAuthError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }
    
    setAuthError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    await login(email);
    setStep('complete');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAsAdmin(adminCredentials.username, adminCredentials.password);
    if (success) {
      navigate('/app/admin');
    } else {
      setAdminError('Invalid credentials');
    }
  };

  const handleComplete = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-black/4 flex items-center justify-center p-4">
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        transition={motionConfig.smooth}
        className="w-full max-w-md"
      >
        <Card className="shadow-high-key-lg border-border">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ ...motionConfig.slow, type: 'spring' }}
              className="flex items-center justify-center mb-6"
            >
              <div className="h-14 w-14 rounded-2xl bg-black flex items-center justify-center shadow-high-key">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-center text-2xl font-bold text-black">
              Welcome to ApplyFlow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 'welcome' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={motionConfig.smooth}
                className="space-y-4"
              >
                <p className="text-center text-black/70 mb-8 leading-relaxed">
                  Choose how you'd like to get started
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="w-full h-12"
                    onClick={() => setStep('login')}
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Sign Up with Email
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full h-12"
                    onClick={handleGuestMode}
                  >
                    <User className="mr-2 h-5 w-5" />
                    Try Demo Mode
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full h-12 text-black/60 hover:text-black"
                    onClick={() => setStep('admin')}
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    Admin Access
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {step === 'login' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={motionConfig.smooth}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">
                    Name
                  </label>
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {authError && <p className="text-red-500 text-sm font-medium">{authError}</p>}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setStep('welcome')}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleLogin}
                    disabled={!email || !name || !password}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={motionConfig.smooth}
                className="space-y-4"
              >
                <p className="text-center text-black/70 mb-6 leading-relaxed">
                  Select a demo profile to get started
                </p>
                <div className="space-y-3">
                  {[
                    {
                      id: 'developer' as DemoProfile,
                      icon: Code,
                      title: 'Developer',
                      description: 'Senior roles at top tech companies',
                      color: 'bg-black/4 text-black',
                    },
                    {
                      id: 'freelancer' as DemoProfile,
                      icon: Briefcase,
                      title: 'Freelancer',
                      description: 'Remote contract and hourly work',
                      color: 'bg-black/4 text-black',
                    },
                    {
                      id: 'student' as DemoProfile,
                      icon: GraduationCap,
                      title: 'Student',
                      description: 'Entry-level and internship positions',
                      color: 'bg-black/4 text-black',
                    },
                    {
                      id: 'manager' as DemoProfile,
                      icon: Users,
                      title: 'Manager',
                      description: 'Leadership and management roles',
                      color: 'bg-black/4 text-black',
                    },
                    {
                      id: 'designer' as DemoProfile,
                      icon: Palette,
                      title: 'Designer',
                      description: 'UX/UI and product design roles',
                      color: 'bg-black/4 text-black',
                    },
                    {
                      id: 'researcher' as DemoProfile,
                      icon: FlaskConical,
                      title: 'Researcher',
                      description: 'ML, data science, and research',
                      color: 'bg-black/4 text-black',
                    },
                  ].map((profile) => (
                    <motion.button
                      key={profile.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleProfileSelect(profile.id)}
                      className={`w-full p-4 rounded-xl border-2 border-border hover:border-black transition-all text-left ${selectedProfile === profile.id ? 'border-black bg-black/4' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl ${profile.color} flex items-center justify-center`}>
                          <profile.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-black">{profile.title}</p>
                          <p className="text-sm text-black/70">{profile.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setStep('welcome')}
                  className="w-full mt-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </motion.div>
            )}

            {step === 'admin' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={motionConfig.smooth}
                className="space-y-5"
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
                    <Input
                      type="text"
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                      placeholder="Enter username"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">Password</label>
                    <Input
                      type="password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                      placeholder="Enter password"
                    />
                  </div>
                  {adminError && (
                    <p className="text-red-500 text-sm">{adminError}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="ghost"
                      onClick={() => setStep('welcome')}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
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
            )}

            {step === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={motionConfig.smooth}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...motionConfig.slow, type: 'spring' }}
                  className="h-20 w-20 rounded-full bg-black/4 flex items-center justify-center mx-auto mb-4 shadow-high-key"
                >
                  <Sparkles className="h-10 w-10 text-black" />
                </motion.div>
                <h3 className="text-2xl font-bold text-black">You're all set!</h3>
                <p className="text-black/70 leading-relaxed">
                  Your workspace is ready. Let's start tracking your job applications.
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="w-full h-12"
                    onClick={handleComplete}
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
