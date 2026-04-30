import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Bell,
  Check,
  CheckCircle,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  Briefcase,
  Calendar,
  Star,
  AlertCircle,
  Info,
  CheckSquare,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import { useNotificationStore } from '../features';
import type { NotificationType } from '../features';

export default function Notifications() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    unreadCount
  } = useNotificationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');

  const notificationTypes: { type: NotificationType; label: string; icon: React.ComponentType; color: string }[] = [
    { type: 'application', label: 'Applications', icon: Briefcase, color: 'bg-blue-100 text-blue-700' },
    { type: 'interview', label: 'Interviews', icon: Calendar, color: 'bg-purple-100 text-purple-700' },
    { type: 'offer', label: 'Offers', icon: Star, color: 'bg-green-100 text-green-700' },
    { type: 'reminder', label: 'Reminders', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
    { type: 'success', label: 'Success', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    { type: 'error', label: 'Errors', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
    { type: 'info', label: 'Info', icon: Info, color: 'bg-blue-100 text-blue-700' },
    { type: 'warning', label: 'Warnings', icon: AlertCircle, color: 'bg-orange-100 text-orange-700' }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesRead = filterRead === 'all' ||
      (filterRead === 'read' && notification.read) ||
      (filterRead === 'unread' && !notification.read);
    return matchesSearch && matchesType && matchesRead;
  });

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedNotifications.size > 0) {
      // Bulk delete functionality to be implemented
      setSelectedNotifications(new Set());
    }
  };

  const handleBulkMarkAsRead = () => {
    if (selectedNotifications.size > 0) {
      Array.from(selectedNotifications).forEach(id => markAsRead(id));
      setSelectedNotifications(new Set());
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: NotificationType) => {
    const typeConfig = notificationTypes.find(t => t.type === type);
    return typeConfig?.icon || Bell;
  };

  const getNotificationColor = (type: NotificationType) => {
    const typeConfig = notificationTypes.find(t => t.type === type);
    return typeConfig?.color || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            onClick={() => { }}
            disabled={notifications.filter(n => n.read).length === 0}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg border border-slate-200 p-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as NotificationType | 'all')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="all">All Types</option>
                  {notificationTypes.map(({ type, label }) => (
                    <option key={type} value={type}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={filterRead}
                  onChange={(e) => setFilterRead(e.target.value as 'all' | 'read' | 'unread')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      {selectedNotifications.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <span className="text-blue-900 font-medium">
              {selectedNotifications.size} notification{selectedNotifications.size !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkMarkAsRead}
              className="flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Mark Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </motion.div>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              All Notifications ({filteredNotifications.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                onChange={handleSelectAll}
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-600">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <AnimatePresence>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No notifications found</p>
                </div>
              ) : (
                filteredNotifications.map((notification, index) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group flex items-start gap-3 p-4 rounded-lg border transition-all hover:bg-slate-50 ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(notification.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedNotifications);
                          if (e.target.checked) {
                            newSelected.add(notification.id);
                          } else {
                            newSelected.delete(notification.id);
                          }
                          setSelectedNotifications(newSelected);
                        }}
                        className="mt-1 rounded border-slate-300"
                      />
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getNotificationColor(notification.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-slate-900 ${!notification.read ? 'font-bold' : ''}`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-slate-500">
                                {formatDate(notification.createdAt)}
                              </span>
                              {notification.metadata?.companyName && (
                                <span className="text-xs text-slate-500">
                                  {notification.metadata.companyName}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { }}
                                className="text-slate-600 hover:bg-slate-50"
                              >
                                <EyeOff className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { }}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
