import { useState, useMemo } from 'react';
import { Clock, Search, Trash2, Plus, Edit, Share2, Trash, Move } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useActivityStore, type ActivityItem } from '../store/modules/activityStore';
import { EmptyState } from '../components/shared/EmptyState';
import { cn } from '../lib/utils';

const activityTypeConfig = {
  create: {
    color: 'bg-black/4 text-black',
    label: 'Created',
    icon: Plus
  },
  edit: {
    color: 'bg-black/4 text-black',
    label: 'Updated',
    icon: Edit
  },
  delete: {
    color: 'bg-black/4 text-black',
    label: 'Deleted',
    icon: Trash
  },
  move: {
    color: 'bg-black/4 text-black',
    label: 'Moved',
    icon: Move
  },
  share: {
    color: 'bg-black/4 text-black',
    label: 'Shared',
    icon: Share2
  },
  status_change: {
    color: 'bg-black/4 text-black',
    label: 'Status Changed',
    icon: Move
  },
};

export default function Activity() {
  const { activities, getActivities, clearActivities } = useActivityStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter activities based on search query
  const filteredActivities = useMemo(() => {
    const allActivities = getActivities();
    if (!searchQuery.trim()) {
      return allActivities;
    } else {
      const query = searchQuery.toLowerCase();
      return allActivities.filter(activity =>
        activity.entityName.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.type.toLowerCase().includes(query)
      );
    }
  }, [searchQuery, getActivities]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    const config = activityTypeConfig[type];
    const Icon = config.icon;
    return <Icon className="w-4 h-4" />;
  };

  const handleClearActivities = () => {
    if (window.confirm('Are you sure you want to clear all activities?')) {
      clearActivities();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Activity</h1>
          <p className="text-black/70">Track your recent actions and changes</p>
        </div>
        {activities.length > 0 && (
          <Button
            variant="ghost"
            onClick={handleClearActivities}
            className="text-black hover:text-black hover:bg-black/4"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black/40" />
        <Input
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          title="No activities found"
          description={
            searchQuery
              ? "No activities match your search criteria"
              : "Your activities will appear here as you use the app"
          }
          icon={Clock}
        />
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => {
            const config = activityTypeConfig[activity.type];
            return (
              <Card key={activity.id} className="hover:shadow-high-key-hover transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-lg flex-shrink-0 shadow-high-key",
                      config.color
                    )}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge className={config.color}>
                            {config.label}
                          </Badge>
                          <span className="font-medium text-black">
                            {activity.entityName}
                          </span>
                        </div>
                        <span className="text-xs text-black/50">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-black/70 mt-1">
                        {activity.description}
                      </p>
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-2 text-xs text-black/50">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <span key={key} className="mr-3">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}