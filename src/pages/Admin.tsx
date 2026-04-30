import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Users, Building2, BarChart3, Settings, Bot,
  Trash2, Edit2, Power, PowerOff, Crown, Sparkles,
  UserCheck, CheckCircle, Activity as ActivityIcon
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuthStore, useJobStore } from '../features';
import { useActivityStore } from '../store/modules/activityStore';
import { useNavigate } from 'react-router-dom';
import { staggerContainer, listItem } from '../lib/motion';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, toggleAIAdmin } = useAuthStore();
  const { jobs } = useJobStore();
  const { activities } = useActivityStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [aiAdminEnabled, setAIAdminEnabled] = useState(user?.aiAdminEnabled || false);
  const [liveActivities, setLiveActivities] = useState(activities.slice(0, 20));

  // Sync live activities with store
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLiveActivities(activities.slice(0, 20));
  }, [activities]);

  // Mock data for demo
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', isGuest: false, status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', isGuest: false, status: 'active' },
    { id: '3', name: 'Guest User', email: 'guest@applyflow.app', role: 'user', isGuest: true, status: 'active' },
  ];

  const mockCompanies = [
    { id: '1', name: 'Google', jobs: 5, status: 'active' },
    { id: '2', name: 'Meta', jobs: 3, status: 'active' },
    { id: '3', name: 'Amazon', jobs: 7, status: 'active' },
  ];

  const stats = {
    totalUsers: mockUsers.length,
    totalGuests: mockUsers.filter(u => u.isGuest).length,
    totalCompanies: mockCompanies.length,
    totalJobs: jobs.length,
    aiAdminActive: aiAdminEnabled,
  };

  if (!isAdmin()) {
    navigate('/');
    return null;
  }

  const handleToggleAIAdmin = () => {
    const newState = !aiAdminEnabled;
    setAIAdminEnabled(newState);
    toggleAIAdmin(newState);
  };

  const handleDeleteUser = () => {
    // TODO: Implement user deletion logic
  };

  const handleDeleteCompany = () => {
    // TODO: Implement company deletion logic
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6 p-6"
    >
      {/* Header */}
      <motion.div variants={listItem} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-high-key">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">Admin Panel</h1>
            <p className="text-black/60">President Control Center</p>
          </div>
        </div>
        <Badge variant="success" className="bg-blue-500 text-white border-blue-500">
          <Shield className="w-4 h-4 mr-1" />
          Administrator
        </Badge>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={listItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black/60">Total Users</p>
                <p className="text-2xl font-bold text-black">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black/60">Guest Users</p>
                <p className="text-2xl font-bold text-black">{stats.totalGuests}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black/60">Companies</p>
                <p className="text-2xl font-bold text-black">{stats.totalCompanies}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black/60">Total Jobs</p>
                <p className="text-2xl font-bold text-black">{stats.totalJobs}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Assistant Control */}
      <motion.div variants={listItem}>
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-black">AI Assistant Administration</CardTitle>
                  <p className="text-sm text-black/60">Vice-President Access Control</p>
                </div>
              </div>
              <Badge variant={aiAdminEnabled ? 'success' : 'default'}>
                {aiAdminEnabled ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-blue-100">
                <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-black mb-1">AI Assistant Capabilities</h4>
                  <p className="text-sm text-black/70 leading-relaxed">
                    When enabled, AI Assistant can monitor user activity, create job applications,
                    track real-time activity, change settings, view/edit companies, and access analytics.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  {aiAdminEnabled ? (
                    <Power className="w-5 h-5 text-green-500" />
                  ) : (
                    <PowerOff className="w-5 h-5 text-black/40" />
                  )}
                  <div>
                    <p className="font-semibold text-black">AI Admin Access</p>
                    <p className="text-sm text-black/60">
                      {aiAdminEnabled ? 'AI Assistant has administrative privileges' : 'AI Assistant in standard mode'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleToggleAIAdmin}
                  variant={aiAdminEnabled ? 'secondary' : 'primary'}
                  className={aiAdminEnabled ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' : ''}
                >
                  {aiAdminEnabled ? 'Disable Access' : 'Enable Access'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={listItem}>
        <div className="flex gap-2 border-b border-border pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'live-activity', label: 'Live Activity', icon: ActivityIcon },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'companies', label: 'Companies', icon: Building2 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-black/60 hover:bg-black/4'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div variants={listItem}>
        {activeTab === 'overview' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-black">System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-black">System Status</p>
                    <p className="text-sm text-black/60">All systems operational</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-black">Security Status</p>
                    <p className="text-sm text-black/60">Admin access secured</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'live-activity' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-black">Live User Activity</CardTitle>
                <Badge variant="success" className="animate-pulse">
                  <ActivityIcon className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {liveActivities.length === 0 ? (
                <div className="text-center py-8 text-black/60">
                  <ActivityIcon className="w-12 h-12 mx-auto mb-3 text-black/20" />
                  <p>No activity recorded yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {liveActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 bg-white rounded-xl border border-border hover:border-blue-200 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <ActivityIcon className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black text-sm">{activity.description}</p>
                        <p className="text-xs text-black/60 mt-0.5 truncate">{activity.description}</p>
                        <p className="text-[10px] text-black/40 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-black">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-border hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-black">{user.name}</p>
                        <p className="text-sm text-black/60">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.isGuest ? 'default' : 'success'}>
                        {user.isGuest ? 'Guest' : 'User'}
                      </Badge>
                      <Badge variant="success">{user.status}</Badge>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleDeleteUser}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'companies' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Company Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-border hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-black">{company.name}</p>
                        <p className="text-sm text-black/60">{company.jobs} jobs tracked</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">{company.status}</Badge>
                      <Button size="sm" variant="secondary">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleDeleteCompany}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-black">System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border">
                  <div>
                    <p className="font-semibold text-black">Maintenance Mode</p>
                    <p className="text-sm text-black/60">Temporarily disable user access</p>
                  </div>
                  <Button size="sm" variant="secondary">
                    Disable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border">
                  <div>
                    <p className="font-semibold text-black">Clear All Data</p>
                    <p className="text-sm text-black/60">Reset all user data (irreversible)</p>
                  </div>
                  <Button size="sm" variant="secondary" className="text-red-600 hover:bg-red-50">
                    Clear Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
