'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, Briefcase, Calendar, Award, 
  ArrowRight, Sparkles, Clock, AlertTriangle 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardData {
  full_name: string;
  profile_completion: number;
  total_applications: number;
  active_applications: number;
  interviews_scheduled: number;
  offers_received: number;
  upcoming_deadlines: Array<{
    category: string;
    title: string;
    deadline: string;
  }>;
  status_distribution: Array<{
    status: string;
    count: number;
  }>;
  top_matches: Array<{
    internship_id: number;
    title: string;
    company_name: string;
    location: string;
    stipend: string;
    match_percentage: number;
    eligible: boolean;
  }>;
}

interface StudentDashboardTabProps {
  data: DashboardData | null;
  onNavigate: (tab: string) => void;
}

const COLORS = ['#f43f5e', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a7f3d0'];

export default function StudentDashboardTab({ data, onNavigate }: StudentDashboardTabProps) {
  const [githubProfile, setGithubProfile] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const active = localStorage.getItem('github_active_profile');
      if (active) {
        setGithubProfile(JSON.parse(active));
      }
    }
  }, []);

  const getAchievements = () => {
    const list = [];
    
    // 1. DBMS Prodigy - 100% completion
    list.push({
      id: 'dbms_prodigy',
      title: 'DBMS Prodigy',
      emoji: '💾',
      unlocked: data.profile_completion === 100
    });

    const isGithubLinked = !!githubProfile;
    const isShrimanasa = githubProfile?.username?.toLowerCase() === 'shrimanasa';

    // 2. Quickdraw
    list.push({
      id: 'quickdraw',
      title: 'Quickdraw',
      emoji: '🤠',
      unlocked: isGithubLinked && isShrimanasa
    });

    // 3. YOLO
    list.push({
      id: 'yolo',
      title: 'YOLO',
      emoji: '🌈',
      unlocked: isGithubLinked && isShrimanasa
    });

    // 4. Pull Shark
    list.push({
      id: 'pull_shark',
      title: 'Pull Shark',
      emoji: '🦈',
      unlocked: isGithubLinked
    });

    return list;
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Check if status distribution has items
  const pieData = data.status_distribution.length > 0 
    ? data.status_distribution.map(item => ({ name: item.status, value: item.count }))
    : [{ name: 'No Applications', value: 1 }];

  return (
    <div className="space-y-6">
      {/* Header and Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {data.full_name}!
          </h1>
          <p className="text-slate-500 mt-1">Here is a summary of your internship readiness and pipeline progress.</p>
          {getAchievements().filter(b => b.unlocked).length > 0 && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Earned Badges:</span>
              {getAchievements().filter(b => b.unlocked).map(badge => (
                <span 
                  key={badge.id} 
                  title={badge.title} 
                  className="w-7 h-7 rounded-lg bg-pink-50 border border-pink-100/80 flex items-center justify-center text-sm shadow-xs cursor-pointer hover:scale-110 transition-transform"
                >
                  {badge.emoji}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('explorer')}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-accent rounded-xl hover:bg-rose-600 transition-all shadow-md shadow-rose-100 flex items-center gap-1.5"
          >
            Browse Internships
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Profile Completion Widget */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden bg-gradient-to-r from-white/70 via-white/50 to-rose-50/20 border-rose-100/50">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center gap-2 text-accent font-semibold text-sm">
            <Sparkles size={16} />
            <span>Profile Completion Readiness</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Complete your profile to unlock all features</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Adding your skills, education details, and resume allows our database matching algorithm to accurately score your eligibility and match percentage for corporate listings.
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Simple circular indicator */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" className="stroke-slate-200 fill-none" strokeWidth="6" />
              <circle cx="48" cy="48" r="40" className="stroke-accent fill-none" strokeWidth="6"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * data.profile_completion) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-lg font-extrabold text-slate-800">{data.profile_completion}%</span>
          </div>
          <button 
            onClick={() => onNavigate('profile')}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all hover:shadow-sm"
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
            <Briefcase size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Applied</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-0.5">{data.total_applications}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-500 flex items-center justify-center shrink-0">
            <CheckCircle size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Tracks</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-0.5">{data.active_applications}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center shrink-0">
            <Calendar size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Interviews</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-0.5">{data.interviews_scheduled}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Offers</span>
            <span className="text-2xl font-extrabold text-emerald-600 block mt-0.5">{data.offers_received}</span>
          </div>
        </div>
      </div>

      {/* Upcoming Events vs Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines / Schedule */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-slate-400" />
              <span>Upcoming Deadlines & Schedule</span>
            </h3>
            {data.upcoming_deadlines.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <AlertTriangle size={32} className="mb-2 text-slate-300" />
                <p className="text-sm">No upcoming deadlines or reminders found.</p>
                <p className="text-xs text-slate-400 mt-1">Set a reminder or save an internship to see it here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.upcoming_deadlines.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 font-bold text-xs uppercase">
                      {event.category.slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 truncate">{event.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{event.category}</p>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 shrink-0">
                      {new Date(event.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {data.upcoming_deadlines.length > 0 && (
            <button 
              onClick={() => onNavigate('reminders')}
              className="w-full text-center text-xs font-semibold text-accent hover:underline mt-4 block"
            >
              Manage Reminders
            </button>
          )}
        </div>

        {/* Recharts PieChart status */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Pipeline Status Ratio</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={data.status_distribution.length > 0 ? COLORS[index % COLORS.length] : '#e2e8f0'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} application(s)`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center">
            {data.status_distribution.length > 0 ? (
              data.status_distribution.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span>{item.status}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400">No applications filed yet.</div>
            )}
          </div>
        </div>

        {/* GitHub & Badges card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between bg-gradient-to-br from-white/70 via-white/50 to-pink-50/10">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award size={18} className="text-rose-500" />
              <span>GitHub Credentials</span>
            </h3>

            {githubProfile ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={githubProfile.avatar_url} 
                    alt={githubProfile.name}
                    className="w-11 h-11 rounded-xl border border-pink-100 shadow-sm"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{githubProfile.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">@{githubProfile.username}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {getAchievements().map(badge => (
                    <div 
                      key={badge.id}
                      title={`${badge.title}: ${badge.unlocked ? 'Unlocked' : 'Locked'}`}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base transition-all ${
                        badge.unlocked 
                          ? 'bg-white border-pink-200 shadow-xs scale-100 hover:scale-110 cursor-pointer' 
                          : 'bg-slate-100/50 border-slate-100 grayscale opacity-40'
                      }`}
                    >
                      {badge.emoji}
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-500 bg-white/40 p-2.5 rounded-xl border border-slate-100/50 leading-relaxed">
                  {githubProfile.bio ? `"${githubProfile.bio}"` : 'Sync your profile in My Profile tab to load your GitHub stats here.'}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-xs text-slate-400">No GitHub integration synced yet.</p>
                <button
                  type="button"
                  onClick={() => onNavigate('profile')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs transition-all border border-slate-200/50"
                >
                  Configure Sync
                </button>
              </div>
            )}
          </div>
          
          {githubProfile && (
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4 flex items-center gap-1.5">
              <span>Status: Active Developer</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
          )}
        </div>
      </div>

      {/* Recommended/Top Matched Internships */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-rose-500" />
          <span>Top Matches Based on Your Skills</span>
        </h3>
        
        {data.top_matches.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p className="text-sm">No open matched internships found.</p>
            <p className="text-xs text-slate-400 mt-1">Complete your skills taxonomy to see matches.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {data.top_matches.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/40 border border-slate-200/50 hover:bg-white/80 transition-all flex flex-col justify-between hover:shadow-sm">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                      {item.match_percentage}% Match
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {item.location}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{item.company_name}</p>
                </div>
                <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-600 font-bold">{item.stipend}</span>
                  <button 
                    onClick={() => onNavigate('explorer')}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
