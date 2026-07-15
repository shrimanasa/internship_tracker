'use client';

import { 
  Users, Building, Briefcase, Award, 
  ArrowRight, ShieldCheck, Database, Calendar 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardData {
  stats: {
    total_students: number;
    placed_students: number;
    placement_rate: number;
    active_companies: number;
    open_internships: number;
    total_applications: number;
    pending_interviews: number;
    average_placed_stipend: number;
  };
  department_placements: Array<{
    department: string;
    total: number;
    placed: number;
    rate: number;
  }>;
  application_funnel: Array<{
    stage: string;
    count: number;
  }>;
  popular_skills: Array<{
    skill: string;
    count: number;
  }>;
}

interface AdminDashboardTabProps {
  data: AdminDashboardData | null;
  onNavigate: (tab: string) => void;
}

const COLORS = ['#60a5fa', '#a78bfa', '#f43f5e', '#34d399', '#fbbf24'];

export default function AdminDashboardTab({ data, onNavigate }: AdminDashboardTabProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const { stats, department_placements, popular_skills } = data;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Placement Admin Console</h1>
        <p className="text-slate-500 mt-1">Monitor college-wide placement statistics, company relationships, and student tracks.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/70 transition-all" onClick={() => onNavigate('students')}>
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Students</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-0.5">{stats.total_students}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/70 transition-all" onClick={() => onNavigate('companies')}>
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-500 flex items-center justify-center shrink-0">
            <Building size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Companies</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-0.5">{stats.active_companies}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/70 transition-all" onClick={() => onNavigate('internships')}>
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
            <Briefcase size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Open Positions</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-0.5">{stats.open_internships}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/70 transition-all" onClick={() => onNavigate('reports')}>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Placement Rate</span>
            <span className="text-2xl font-extrabold text-emerald-600 block mt-0.5">{stats.placement_rate}%</span>
          </div>
        </div>
      </div>

      {/* College Statistics View Aggregated */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Placement BarChart */}
        <div className="glass-panel p-6 rounded-3xl lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Database size={16} />
            <span>Placement Ratio by Department Branch</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={department_placements}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'Placement %', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value}% Placement Rate`, 'Rate']} />
                <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                  {department_placements.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Demanded Skills */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={16} />
            <span>Demanded Skills (Corporate Postings)</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popular_skills} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="skill" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                <Tooltip formatter={(value) => [`Demanded in ${value} roles`, 'Postings']} />
                <Bar dataKey="count" fill="#f43f5e" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Extra KPI grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-rose-400">Financial Average</span>
            <h4 className="text-2xl font-bold mt-1">
              {stats.average_placed_stipend.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Calculated average stipend of accepted offers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Total Applications Files</span>
            <h4 className="text-2xl font-bold text-slate-800 mt-1">{stats.total_applications}</h4>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Total active application pipelines registered in PostgreSQL.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Interview Sessions</span>
            <h4 className="text-2xl font-bold text-slate-800 mt-1">{stats.pending_interviews} Pending</h4>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Live HR/technical interview rounds currently scheduled.
          </p>
        </div>
      </div>
    </div>
  );
}
