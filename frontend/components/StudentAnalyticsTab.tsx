'use client';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { BarChart2, TrendingUp, HelpCircle, Inbox } from 'lucide-react';

interface AnalyticsData {
  total_applications: number;
  active_applications: number;
  interviews_scheduled: number;
  offers_received: number;
  status_distribution: Array<{
    status: string;
    count: number;
  }>;
  applications_by_month: Array<{
    month: string;
    count: number;
  }>;
}

interface StudentAnalyticsTabProps {
  analytics: AnalyticsData | null;
}

const COLORS = ['#f43f5e', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#c084fc'];

export default function StudentAnalyticsTab({ analytics }: StudentAnalyticsTabProps) {
  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const hasData = analytics.total_applications > 0;

  // Prepare funnel data
  const appliedCount = analytics.total_applications;
  
  // Calculate interviewed and offered counts based on status distribution values
  const interviewStatuses = ['Interview Scheduled', 'Interview Completed', 'Offer Received', 'Offer Accepted', 'Offer Declined'];
  const offerStatuses = ['Offer Received', 'Offer Accepted', 'Offer Declined'];
  
  const interviewedCount = analytics.status_distribution
    .filter(item => interviewStatuses.includes(item.status))
    .reduce((sum, item) => sum + item.count, 0);

  const offeredCount = analytics.status_distribution
    .filter(item => offerStatuses.includes(item.status))
    .reduce((sum, item) => sum + item.count, 0);

  const funnelData = [
    { name: 'Applied Pipeline', count: appliedCount, fill: '#60a5fa' },
    { name: 'Shortlist / Interview', count: interviewedCount, fill: '#a78bfa' },
    { name: 'Offer Received', count: offeredCount, fill: '#34d399' }
  ];

  // Convert status distribution for charts
  const statusChartData = analytics.status_distribution.map(item => ({
    name: item.status,
    value: item.count
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Personal Analytics</h1>
        <p className="text-slate-500 mt-1">Visualize your application pipeline funnel, success metrics, and monthly volumes.</p>
      </div>

      {!hasData ? (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4 max-w-2xl mx-auto mt-8">
          <Inbox size={48} className="mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-800 text-lg">Insufficient Application Data</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            There is not enough active tracking records in your student profile to compile dashboard charts. Try adding listed internships or manually tracking your external applications to view match analysis.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Funnel and Status ratio row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp size={16} />
                <span>Conversion Pipeline Funnel</span>
              </h3>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={120} />
                    <Tooltip formatter={(value) => [`${value} candidate tracks`, 'Count']} />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Application Status distribution */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BarChart2 size={16} />
                <span>Status Breakdown</span>
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} application(s)`, 'Count']} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Monthly applications trends */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Monthly Volume Trends</h3>
            {analytics.applications_by_month.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">Insufficient month-by-month timeline.</div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.applications_by_month} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <Tooltip formatter={(value) => [`${value} applications`, 'Volume']} />
                    <Area type="monotone" dataKey="count" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApps)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
