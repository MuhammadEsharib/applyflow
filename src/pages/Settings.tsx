import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../features';
import { useNotificationStore } from '../features';
import { useToastNotifications } from '../hooks/useToastNotifications';
import { storage } from '../lib/storage';
import { Download, Upload, Trash2, User, Bell, Shield, Globe, Bot, Crown, Users, Plus, SwitchCamera } from 'lucide-react';

type TabType = 'profile' | 'notifications' | 'privacy' | 'data' | 'ai' | 'guests';

interface SettingsState {
  profile: {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    jobAlerts: boolean;
    applicationUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    dataSharing: boolean;
    analyticsTracking: boolean;
    cookieConsent: boolean;
  };
}

export default function Settings() {
  const { user, isAdmin, toggleAIAdmin, getGuestAccounts, createNewGuest, switchGuest, guestId } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { settingsChanged } = useToastNotifications();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiAdminEnabled, setAIAdminEnabled] = useState(user?.aiAdminEnabled || false);
  const [guestAccounts, setGuestAccounts] = useState(getGuestAccounts());

  const savedSettings = storage.get('userSettings', null) as SettingsState | null;
  const defaultSettings: SettingsState = {
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
      bio: '',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      jobAlerts: true,
      applicationUpdates: true,
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
      analyticsTracking: true,
      cookieConsent: true,
    },
  };

  const [settings, setSettings] = useState<SettingsState>(savedSettings ?? defaultSettings);

  const updateSetting = (category: keyof SettingsState, key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    storage.set('userSettings', settings);
    settingsChanged('Settings saved successfully');
    setTimeout(() => {
      addNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your settings have been updated successfully',
      });
    }, 0);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = {
        settings,
        jobs: storage.get('jobs', []),
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applyflow-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      settingsChanged('Data exported successfully');
      setTimeout(() => {
        addNotification({
          type: 'success',
          title: 'Data Exported',
          message: 'Your data has been exported successfully',
        });
      }, 0);
    } catch {
      setTimeout(() => {
        addNotification({
          type: 'error',
          title: 'Export Failed',
          message: 'Failed to export your data',
        });
      }, 0);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Import jobs
        if (data.jobs) {
          storage.set('jobs', data.jobs);
        }

        // Import settings
        if (data.settings) {
          setSettings(data.settings);
          storage.set('userSettings', data.settings);
        }

        settingsChanged('Data imported successfully');
        setTimeout(() => {
          addNotification({
            type: 'success',
            title: 'Data Imported',
            message: 'Your data has been imported successfully',
          });
        }, 0);
      } catch {
        setTimeout(() => {
          addNotification({
            type: 'error',
            title: 'Import Failed',
            message: 'Failed to import your data. Please check the file format.',
          });
        }, 0);
      } finally {
        setIsImporting(false);
      }
    };

    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      storage.clear();
      setSettings({
        profile: {
          name: user?.name || '',
          email: user?.email || '',
          phone: '',
          location: '',
          bio: '',
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          jobAlerts: true,
          applicationUpdates: true,
        },
        privacy: {
          profileVisibility: 'public',
          dataSharing: false,
          analyticsTracking: true,
          cookieConsent: true,
        },
      });
      settingsChanged('All data cleared');
      setTimeout(() => {
        addNotification({
          type: 'info',
          title: 'Data Cleared',
          message: 'All your data has been cleared',
        });
      }, 0);
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell },
    { id: 'privacy' as TabType, label: 'Privacy', icon: Shield },
    { id: 'data' as TabType, label: 'Data Management', icon: Globe },
    ...(isAdmin() ? [{ id: 'ai' as TabType, label: 'AI Assistant', icon: Bot }] : []),
    ...(user?.isGuest ? [{ id: 'guests' as TabType, label: 'Guest Accounts', icon: Users }] : []),
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Settings</h1>
          <p className="text-black/70 mt-1">Manage your account preferences and settings</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-black/4 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
              ? 'bg-white text-black shadow-high-key'
              : 'text-black/60 hover:text-black'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Full Name
                  </label>
                  <Input
                    value={settings.profile.name}
                    onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                    placeholder="Enter your name"
                    className='text-black'
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                    placeholder="Enter your email"
                    className='text-black'
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className='text-black'
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Location
                  </label>
                  <Input
                    value={settings.profile.location}
                    onChange={(e) => updateSetting('profile', 'location', e.target.value)}
                    placeholder="City, Country"
                    className='text-black'
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Bio
                </label>
                <textarea
                  value={settings.profile.bio}
                  onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-black/60">
                      {key === 'emailNotifications' && 'Receive email notifications'}
                      {key === 'pushNotifications' && 'Receive push notifications'}
                      {key === 'jobAlerts' && 'Get alerts for new job opportunities'}
                      {key === 'applicationUpdates' && 'Updates on your application status'}
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('notifications', key, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-black' : 'bg-black/4'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black">Profile Visibility</div>
                    <div className="text-sm text-black/60">Control who can see your profile</div>
                  </div>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-white text-black"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                {Object.entries(settings.privacy)
                  .filter(([key]) => key !== 'profileVisibility')
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-black capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm text-black/60">
                          {key === 'dataSharing' && 'Share anonymous usage data'}
                          {key === 'analyticsTracking' && 'Help us improve with analytics'}
                          {key === 'cookieConsent' && 'Accept cookies for better experience'}
                        </div>
                      </div>
                      <button
                        onClick={() => updateSetting('privacy', key, !value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-black' : 'bg-black/4'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Management */}
        {activeTab === 'data' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium text-black">Export Data</div>
                    <div className="text-sm text-black/60">Download all your data</div>
                  </div>
                  <Button
                    onClick={handleExportData}
                    disabled={isExporting}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {isExporting ? 'Exporting...' : 'Export'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium text-black">Import Data</div>
                    <div className="text-sm text-black/60">Restore from backup</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                      id="import-file"
                    />
                    <Button
                      asChild
                      disabled={isImporting}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <label htmlFor="import-file" className="cursor-pointer flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        {isImporting ? 'Importing...' : 'Import'}
                      </label>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-black/30 rounded-lg">
                  <div>
                    <div className="font-medium text-black">Clear All Data</div>
                    <div className="text-sm text-black/60">Delete all your data permanently</div>
                  </div>
                  <Button
                    onClick={handleClearData}
                    variant="outline"
                    className="flex items-center gap-2 text-black border-black/30 hover:bg-black/4"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Assistant Settings */}
        {activeTab === 'ai' && (
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Assistant Administration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100">
                <Crown className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-semibold text-black">Vice-President Access</p>
                  <p className="text-sm text-black/60">Control AI Assistant administrative privileges</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-100">
                <div>
                  <div className="font-medium text-black">Enable AI Admin Access</div>
                  <div className="text-sm text-black/60">
                    {aiAdminEnabled
                      ? 'AI Assistant can monitor, create applications, track activity, change settings, and manage companies'
                      : 'AI Assistant in standard mode with limited capabilities'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newState = !aiAdminEnabled;
                    setAIAdminEnabled(newState);
                    toggleAIAdmin(newState);
                    addNotification({
                      type: 'success',
                      title: 'AI Admin Updated',
                      message: `AI Assistant admin access ${newState ? 'enabled' : 'disabled'}`,
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${aiAdminEnabled ? 'bg-blue-500' : 'bg-black/4'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${aiAdminEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-black/70">
                  <strong>AI Admin Capabilities:</strong> When enabled, the AI Assistant acts as Vice-President with the ability to monitor user activity, create job applications, track real-time activity, change settings, view/edit companies, and access analytics. The Administrator (President) retains full control.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guest Accounts Management */}
        {activeTab === 'guests' && (
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Guest Accounts Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-100">
                <div>
                  <p className="font-semibold text-black">Create New Guest Account</p>
                  <p className="text-sm text-black/60">Create a separate guest account with its own data</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    createNewGuest();
                    setGuestAccounts(getGuestAccounts());
                    addNotification({
                      type: 'success',
                      title: 'Guest Account Created',
                      message: 'New guest account has been created successfully',
                    });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Guest
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-black/70">Available Guest Accounts</p>
                {guestAccounts.length === 0 ? (
                  <div className="p-4 bg-white rounded-xl border border-blue-100 text-center text-black/50">
                    No guest accounts yet. Create one to get started.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {guestAccounts.map((guest) => (
                      <div
                        key={guest.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${guestId === guest.id
                          ? 'bg-blue-100 border-blue-300'
                          : 'bg-white border-blue-100 hover:bg-blue-50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-black">{guest.name}</p>
                            <p className="text-xs text-black/50">
                              Created: {new Date(guest.createdAt).toLocaleDateString()}
                              {guestId === guest.id && ' • Current'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {guestId !== guest.id && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                switchGuest(guest.id);
                                addNotification({
                                  type: 'success',
                                  title: 'Switched Account',
                                  message: 'Switched to guest account successfully',
                                });
                              }}
                            >
                              <SwitchCamera className="w-4 h-4 mr-2" />
                              Switch
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-black/70">
                  <strong>Guest Accounts:</strong> Each guest account has its own separate database for jobs, activities, and settings. You can switch between guest accounts to manage different job searches independently.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}