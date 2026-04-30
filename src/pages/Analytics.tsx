import { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Award, Calendar, BarChart3, Building2, ArrowUpRight, Target, Zap, Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useJobStore } from '../features';
import { EmptyState } from '../components/shared/EmptyState';
import { cn } from '../lib/utils';

const STATUS_COLORS: Record<string, string> = {
  wishlist: '#3b82f6', // blue-500
  applied: '#8b5cf6',  // violet-500
  interview: '#f59e0b', // amber-500
  offer: '#10b981',    // emerald-500
  rejected: '#ef4444',  // red-500
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-blue-200 p-4 shadow-xl rounded-xl backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">
          {payload[0].name}
        </p>
        <p className="text-xl font-black text-black">
          {payload[0].value} <span className="text-xs font-medium text-black/50">Apps</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { jobs } = useJobStore();

  const metrics = useMemo(() => {
    const total = jobs.length;
    const offers = jobs.filter(j => j.status === 'offer').length;
    const interviews = jobs.filter(j => j.status === 'interview').length;

    return [
      { label: 'Total Volume', value: total, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Interview Rate', value: `${total ? ((interviews / total) * 100).toFixed(1) : 0}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Success Rate', value: `${total ? ((offers / total) * 100).toFixed(1) : 0}%`, icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Active Pipeline', value: jobs.filter(j => ['applied', 'interview'].includes(j.status)).length, icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];
  }, [jobs]);

  const statusData = useMemo(() =>
    Object.entries(STATUS_COLORS).map(([name, color]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: jobs.filter(j => j.status === name).length,
      fill: color,
      key: name
    })).filter(d => d.value > 0),
    [jobs]);

  const timelineData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    // Use deterministic mock data instead of Math.random
    const mockValues = [12, 15, 8, 18, 22, 14];
    const interviewValues = [3, 5, 2, 6, 7, 4];
    const offerValues = [1, 2, 0, 2, 3, 1];
    return months.map((month, i) => ({
      name: month,
      applications: mockValues[i],
      interviews: interviewValues[i],
      offers: offerValues[i],
    }));
  }, []);

  if (jobs.length === 0) {
    return <EmptyState icon={BarChart3} title="Data pipeline empty" description="Add your first application to unlock visual search analytics." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 lg:p-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black">
            Analytics
          </h1>
          <p className="text-base md:text-lg font-medium text-black/60">
            Visualizing your path to the next offer.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-200">
          <ArrowUpRight size={14} />
          SYSTEMS ACTIVE
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((item, i) => (
          <Card key={i} className="border border-blue-100 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className={cn("inline-flex p-2 md:p-2.5 rounded-xl mb-3 md:mb-4 shadow-md", item.bg)}>
                <item.icon className={cn("h-4 w-4 md:h-5 md:w-5", item.color)} />
              </div>
              <div className="text-2xl md:text-4xl font-black tracking-tight text-black">
                {item.value}
              </div>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black/40 mt-1">
                {item.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Donut Chart Card */}
        <Card className="lg:col-span-4 border border-blue-100 bg-white shadow-lg">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-black/40 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Funnel Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="h-[280px] md:h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="white"
                    strokeWidth={2}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} className="hover:opacity-80 transition-opacity cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 md:mt-6 justify-center">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.fill }} />
                  <span className="text-[10px] md:text-[11px] font-bold text-black uppercase tracking-wider">
                    {s.name} <span className="ml-1 text-black/40 font-medium">({s.value})</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Line Chart Card */}
        <Card className="lg:col-span-8 border border-blue-100 bg-white shadow-lg">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-black/40 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Application Velocity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6 pt-4">
            <div className="h-[280px] md:h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid vertical={false} stroke="rgba(59, 130, 246, 0.1)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#6b7280' }}
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#9ca3af' }} />
                  <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.1)', radius: 8 }} content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="interviews" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="offers" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Radar Chart - Skills Analysis */}
        <Card className="border border-blue-100 bg-white shadow-lg">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-black/40 flex items-center gap-2">
              <Network className="w-4 h-4" />
              Skills Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="h-[300px] md:h-[350px] w-full">
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <Target className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                  <p>Skills radar chart</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Status Breakdown */}
        <Card className="border border-blue-100 bg-white shadow-lg">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-black/40 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="h-[300px] md:h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid vertical={false} stroke="rgba(59, 130, 246, 0.1)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#6b7280' }}
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#9ca3af' }} />
                  <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.1)', radius: 8 }} content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}