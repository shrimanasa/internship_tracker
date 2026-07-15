'use client';

import Link from 'next/link';
import { 
  Briefcase, CheckCircle, Shield, TrendingUp, BarChart2, 
  MapPin, Clock, Star, Calendar, ChevronRight 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col bg-[#f8fafc]">
      {/* Glow effects simulating Apple-style backdrops */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#fbcfe8] opacity-30 blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#d8b4fe] opacity-30 blur-[130px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

      {/* Header / Nav */}
      <header className="sticky top-0 z-50 glass-nav px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-[#f472b6] flex items-center justify-center text-white shadow-md shadow-rose-200">
            <Briefcase size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            InternTrack
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors">
            Student Login
          </Link>
          <Link href="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-accent rounded-xl hover:bg-rose-600 transition-all hover:scale-102 hover:shadow-lg hover:shadow-rose-100">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto px-6 py-16 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light border border-rose-100 text-accent text-xs font-semibold mb-8 animate-fade-in shadow-sm">
          <Star size={12} fill="currentColor" />
          <span>Next-Gen DBMS College Project</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl leading-[1.15]">
          Track every application. <br />
          <span className="bg-gradient-to-r from-accent via-rose-500 to-[#c084fc] bg-clip-text text-transparent">
            Prepare for every opportunity.
          </span>
        </h1>
        
        <p className="text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Manage your internship profiles, monitor real-time pipelines, analyze skill gaps, and schedule interviews. A comprehensive dashboard system tailored for engineering candidates.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 w-full max-w-md">
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-accent rounded-2xl hover:bg-rose-600 transition-all hover:scale-102 hover:shadow-xl hover:shadow-rose-100 flex items-center justify-center gap-2">
            Create Free Account
            <ChevronRight size={18} />
          </Link>
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-800 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all hover:shadow-sm flex items-center justify-center">
            Sign In
          </Link>
        </div>

        {/* Dynamic Mockup Preview with Apple styling */}
        <div className="w-full max-w-4xl p-2 rounded-[2.5rem] bg-white/40 border border-white/60 shadow-2xl backdrop-blur-md mb-24 overflow-hidden transform hover:scale-[1.01] transition-transform">
          <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] bg-slate-900 border border-slate-800 overflow-hidden flex flex-col relative text-left shadow-inner">
            {/* Top window controls */}
            <div className="bg-slate-950/80 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[11px] font-medium text-slate-500 tracking-wide font-mono">
                interntrack-app.edu/student/dashboard
              </div>
              <div className="w-10"></div>
            </div>
            
            {/* Inner frame mock */}
            <div className="flex-1 flex bg-slate-950 text-slate-200">
              {/* Fake Sidebar */}
              <div className="w-56 border-r border-slate-800 bg-slate-900/60 p-4 hidden md:flex flex-col gap-2">
                <div className="h-6 w-24 bg-slate-800 rounded mb-6"></div>
                <div className="h-9 w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg p-2 mb-2 flex items-center gap-2 text-xs font-semibold">
                  <div className="w-4 h-4 rounded bg-rose-500"></div>
                  Dashboard
                </div>
                <div className="h-9 w-full bg-slate-800/40 rounded-lg p-2 mb-2 flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-4 h-4 rounded bg-slate-700"></div>
                  Explore Internships
                </div>
                <div className="h-9 w-full bg-slate-800/40 rounded-lg p-2 mb-2 flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-4 h-4 rounded bg-slate-700"></div>
                  My Applications
                </div>
                <div className="h-9 w-full bg-slate-800/40 rounded-lg p-2 mb-2 flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-4 h-4 rounded bg-slate-700"></div>
                  Interview Planner
                </div>
              </div>
              
              {/* Fake Content Area */}
              <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Welcome back, Aarav Patel!</h3>
                    <p className="text-xs text-slate-400">SRN2023CSE01 • Department of CSE</p>
                  </div>
                  <div className="h-9 w-36 bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center shadow-md shadow-rose-900/20">
                    Apply for Internships
                  </div>
                </div>

                {/* Fake Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Total Applied</span>
                    <div className="text-2xl font-extrabold text-white mt-1">12</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Under Review</span>
                    <div className="text-2xl font-extrabold text-white mt-1">4</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Interviews</span>
                    <div className="text-2xl font-extrabold text-amber-400 mt-1">2</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Offers Received</span>
                    <div className="text-2xl font-extrabold text-emerald-400 mt-1">1</div>
                  </div>
                </div>

                {/* Fake Match Panel */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active Skill Matching Score</h4>
                    <span className="text-xs text-rose-400 font-semibold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/30">89% Match</span>
                  </div>
                  <div className="text-sm font-semibold text-white">Full Stack Intern - Razorpay Corporation</div>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded-full font-medium">React.js (Verified)</span>
                    <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded-full font-medium">PostgreSQL</span>
                    <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded-full font-medium">TypeScript</span>
                    <span className="text-[10px] bg-rose-950/60 text-rose-400 border border-rose-900/40 px-2 py-0.5 rounded-full font-medium">FastAPI (Gap)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <section className="w-full mb-20 text-left">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-12 text-center">
            Powerful features built for candidate success
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Automated Skill Matching</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Compute detailed match percentages, highlight proficiency gaps, and suggest skills to learn based on specific role listings.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Interview & Offer Planner</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Organize coding, technical, and HR interview rounds. Track official offer letters and deadline responses.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Comprehensive Admin Portal</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enables faculty to audit student applications, check files, verify documents, and export detailed CSV reports.
              </p>
            </div>
          </div>
        </section>

        {/* Database Proof Points */}
        <section className="w-full bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 mb-20 text-left border border-slate-800 shadow-xl">
          <div className="max-w-md">
            <div className="inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
              Academic DBMS Focus
            </div>
            <h3 className="text-2xl font-bold mb-3">Enforcing integrity at the database layer</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Demonstrates 3NF normalization, foreign key restrict/cascade constraints, B-Tree indexing, complex SQL views, and secure row triggers for application histories.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <CheckCircle className="text-emerald-500" size={20} />
              <span className="text-sm font-semibold text-slate-300">Auto Status Logs</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <CheckCircle className="text-emerald-500" size={20} />
              <span className="text-sm font-semibold text-slate-300">Verification Triggers</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <CheckCircle className="text-emerald-500" size={20} />
              <span className="text-sm font-semibold text-slate-300">Skill Gap Views</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <CheckCircle className="text-emerald-500" size={20} />
              <span className="text-sm font-semibold text-slate-300">System Audits</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-auto text-center text-xs text-slate-500 z-10">
        <p className="mb-2">© {new Date().getFullYear()} InternTrack System. College DBMS Lab Project.</p>
        <p>Built with Next.js, FastAPI, and PostgreSQL.</p>
      </footer>
    </div>
  );
}
