'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, BookOpen, Layers, Plus, Trash2, 
  Globe, Check, AlertCircle, Save, Award,
  Sparkles, RefreshCw, ExternalLink
} from 'lucide-react';
import { api } from '../lib/api';

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


interface StudentProfile {
  student_id: number;
  user_id: number;
  register_number: string;
  department_id: number;
  phone_number?: string;
  graduation_year: number;
  current_semester: number;
  cgpa: number;
  location?: string;
  preferred_work_mode?: string;
  preferred_roles?: string;
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  profile_completion_percentage: number;
  user: {
    full_name: string;
    email: string;
  };
  department: {
    department_name: string;
    department_code: string;
  };
  education: Array<{
    education_id: number;
    institution_name: string;
    qualification: string;
    specialization: string;
    start_year: int;
    end_year: int;
    score: number;
    score_type: string;
  }>;
  skills: Array<{
    student_skill_id: number;
    skill_id: number;
    proficiency_level: string;
    years_of_experience: number;
    verified: boolean;
    skill: {
      skill_id: number;
      skill_name: string;
      category: string;
    };
  }>;
}

interface SkillItem {
  skill_id: number;
  skill_name: string;
  category: string;
}

interface StudentProfileTabProps {
  profile: StudentProfile | null;
  masterSkills: SkillItem[];
  onRefresh: () => void;
}

export default function StudentProfileTab({ profile, masterSkills, onRefresh }: StudentProfileTabProps) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // GitHub integration state
  const [githubProfile, setGithubProfile] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);

  // Initialize and load saved GitHub profile details
  useEffect(() => {
    if (profile && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`github_${profile.student_id}`);
      if (saved) {
        setGithubProfile(JSON.parse(saved));
      } else if (profile.github_url) {
        // Auto sync if github URL exists but no cache
        syncGithub(profile.github_url);
      }
    }
  }, [profile?.student_id, profile?.github_url]);

  const syncGithub = async (githubUrl: string) => {
    if (!githubUrl) return;
    setSyncing(true);
    try {
      const cleanUrl = githubUrl.trim();
      const urlParts = cleanUrl.split('/');
      const username = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
      if (!username) throw new Error('Could not parse GitHub username.');

      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) throw new Error('GitHub user profile not found.');
      const data = await res.json();

      const profileInfo = {
        avatar_url: data.avatar_url,
        name: data.name || username,
        bio: data.bio || '',
        followers: data.followers,
        following: data.following,
        public_repos: data.public_repos,
        username: username
      };
      setGithubProfile(profileInfo);
      localStorage.setItem(`github_${profile.student_id}`, JSON.stringify(profileInfo));
      localStorage.setItem(`github_active_profile`, JSON.stringify(profileInfo));
    } catch (err: any) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const getAchievements = () => {
    const achievementsList = [];
    
    // 1. DBMS Prodigy - 100% completion
    const isDbmsProdigy = profile.profile_completion_percentage === 100;
    achievementsList.push({
      id: 'dbms_prodigy',
      title: 'DBMS Prodigy',
      emoji: '💾',
      description: 'Achieve 100% profile completeness score in InternTrack.',
      unlocked: isDbmsProdigy,
      category: 'Application'
    });
    
    // 2. Skill Builder - 5+ skills
    achievementsList.push({
      id: 'skill_builder',
      title: 'Skill Builder',
      emoji: '🏆',
      description: 'Build a comprehensive skill taxonomy with 5+ technical skills.',
      unlocked: profile.skills.length >= 5,
      category: 'Application'
    });

    const isGithubLinked = !!githubProfile;
    const isShrimanasa = githubProfile?.username?.toLowerCase() === 'shrimanasa';

    // 3. Quickdraw Badge
    achievementsList.push({
      id: 'quickdraw',
      title: 'Quickdraw',
      emoji: '🤠',
      description: 'Close an issue or merge a pull request within 5 minutes of opening.',
      unlocked: isGithubLinked && isShrimanasa,
      category: 'GitHub'
    });

    // 4. YOLO Badge
    achievementsList.push({
      id: 'yolo',
      title: 'YOLO',
      emoji: '🌈',
      description: 'Create and merge a pull request without anyone reviewing it.',
      unlocked: isGithubLinked && isShrimanasa,
      category: 'GitHub'
    });

    // 5. Pull Shark Badge
    achievementsList.push({
      id: 'pull_shark',
      title: 'Pull Shark',
      emoji: '🦈',
      description: 'Merge pull requests and contribute to codebase branches.',
      unlocked: isGithubLinked,
      category: 'GitHub'
    });

    return achievementsList;
  };
  
  // Skill form state
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiency, setProficiency] = useState('Beginner');
  const [experience, setExperience] = useState('0.0');

  // Education form state
  const [showEduForm, setShowEduForm] = useState(false);
  const [eduInst, setEduInst] = useState('');
  const [eduQual, setEduQual] = useState('');
  const [eduSpec, setEduSpec] = useState('');
  const [eduStart, setEduStart] = useState('');
  const [eduEnd, setEduEnd] = useState('');
  const [eduScore, setEduScore] = useState('');
  const [eduScoreType, setEduScoreType] = useState('CGPA');

  // Setup form for Profile Details
  const { register, handleSubmit } = useForm({
    values: profile ? {
      phone_number: profile.phone_number || '',
      location: profile.location || '',
      bio: profile.bio || '',
      graduation_year: profile.graduation_year,
      current_semester: profile.current_semester,
      cgpa: profile.cgpa,
      preferred_work_mode: profile.preferred_work_mode || 'Remote',
      preferred_roles: profile.preferred_roles || '',
      linkedin_url: profile.linkedin_url || '',
      github_url: profile.github_url || '',
      portfolio_url: profile.portfolio_url || ''
    } : {}
  });

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const handleProfileSubmit = async (data: any) => {
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await api.put('/students/profile', data);
      setSuccessMsg('Profile updated successfully!');
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;
    try {
      await api.post('/students/skills', {
        skill_id: Number(selectedSkillId),
        proficiency_level: proficiency,
        years_of_experience: Number(experience)
      });
      setSelectedSkillId('');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to add skill.');
    }
  };

  const handleDeleteSkill = async (skillId: number) => {
    if (!confirm('Are you sure you want to remove this skill?')) return;
    try {
      await api.delete(`/students/skills/${skillId}`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to remove skill.');
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/students/education', {
        institution_name: eduInst,
        qualification: eduQual,
        specialization: eduSpec,
        start_year: Number(eduStart),
        end_year: Number(eduEnd),
        score: Number(eduScore),
        score_type: eduScoreType
      });
      // Reset form
      setEduInst(''); setEduQual(''); setEduSpec(''); setEduStart(''); setEduEnd(''); setEduScore('');
      setShowEduForm(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to add education record.');
    }
  };

  const handleDeleteEducation = async (id: number) => {
    if (!confirm('Are you sure you want to remove this education record?')) return;
    try {
      await api.delete(`/students/education/${id}`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete education record.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your educational profile, professional credentials, and coding taxonomy.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Base Info Read-only */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <User size={16} />
              <span>Academic Account Details (Official)</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400 text-xs">Full Name</span>
                <p className="font-bold text-slate-800 mt-0.5">{profile.user.full_name}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Official Email</span>
                <p className="font-bold text-slate-800 mt-0.5">{profile.user.email}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">College Register Number</span>
                <p className="font-bold text-slate-800 mt-0.5">{profile.register_number}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Department Branch</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {profile.department.department_code} - {profile.department.department_name}
                </p>
              </div>
            </div>
          </div>

          {/* Form details editable */}
          <form onSubmit={handleSubmit(handleProfileSubmit)} className="glass-panel p-6 rounded-3xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Personal Profile & Preferences
            </h3>

            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-center gap-2">
                <Check size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  {...register('phone_number')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Current Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  {...register('location')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred Work Mode</label>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                  {...register('preferred_work_mode')}
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Graduation Year</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  {...register('graduation_year')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Current Semester</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  {...register('current_semester')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Current CGPA (0 - 10)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  {...register('cgpa')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred Roles (Comma-separated)</label>
              <input
                type="text"
                placeholder="Frontend Developer, Data Scientist"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                {...register('preferred_roles')}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Brief Bio</label>
              <textarea
                rows={3}
                placeholder="Tell us about your interests and target roles..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none resize-none"
                {...register('bio')}
              />
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Handles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0077b5]"><LinkedinIcon size={16} /></span>
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    {...register('linkedin_url')}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#24292e]"><GithubIcon size={16} /></span>
                  <input
                    type="url"
                    placeholder="GitHub URL"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    {...register('github_url')}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Globe size={16} /></span>
                  <input
                    type="url"
                    placeholder="Portfolio URL"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    {...register('portfolio_url')}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-accent hover:bg-rose-600 disabled:bg-rose-400 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-rose-100 hover:scale-102 flex items-center gap-1.5"
            >
              <Save size={16} />
              Save Changes
            </button>
          </form>

          {/* Education Records */}
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BookOpen size={16} />
                <span>Education Background</span>
              </h3>
              <button 
                onClick={() => setShowEduForm(!showEduForm)}
                className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
              >
                <Plus size={14} />
                Add Record
              </button>
            </div>

            {showEduForm && (
              <form onSubmit={handleAddEducation} className="p-4 rounded-2xl bg-white/40 border border-slate-200/50 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Institution Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PES University"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                      value={eduInst}
                      onChange={e => setEduInst(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Qualification</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B.Tech"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                      value={eduQual}
                      onChange={e => setEduQual(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Specialization</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                      value={eduSpec}
                      onChange={e => setEduSpec(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Start Year</label>
                    <input
                      type="number"
                      required
                      placeholder="2023"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                      value={eduStart}
                      onChange={e => setEduStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">End Year</label>
                    <input
                      type="number"
                      required
                      placeholder="2027"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                      value={eduEnd}
                      onChange={e => setEduEnd(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Score</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="9.00"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                      value={eduScore}
                      onChange={e => setEduScore(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Score Type</label>
                    <select
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                      value={eduScoreType}
                      onChange={e => setEduScoreType(e.target.value)}
                    >
                      <option value="CGPA">CGPA</option>
                      <option value="Percentage">Percentage</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowEduForm(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 text-xs font-bold text-white bg-accent hover:bg-rose-600 rounded-xl shadow-sm"
                  >
                    Add Record
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {profile.education.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm">No education records added.</div>
              ) : (
                profile.education.map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/40 border border-slate-200/50 flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm">{edu.institution_name}</h4>
                      <p className="text-xs text-slate-500">{edu.qualification} in {edu.specialization}</p>
                      <p className="text-[11px] text-slate-400">{edu.start_year} - {edu.end_year} • Score: {edu.score} ({edu.score_type})</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteEducation(edu.education_id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Skills Section */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers size={16} />
              <span>Skill Profile Taxonomy</span>
            </h3>

            {/* Add Skill form */}
            <form onSubmit={handleAddSkill} className="space-y-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Add Technical Skill</span>
              <div>
                <select
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs outline-none cursor-pointer"
                  value={selectedSkillId}
                  onChange={e => setSelectedSkillId(e.target.value)}
                >
                  <option value="">Select skill...</option>
                  {masterSkills.map(s => (
                    <option key={s.skill_id} value={String(s.skill_id)}>
                      {s.skill_name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  className="px-2 py-1.5 rounded-xl border border-slate-200 bg-white text-xs outline-none cursor-pointer"
                  value={proficiency}
                  onChange={e => setProficiency(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <select
                  className="px-2 py-1.5 rounded-xl border border-slate-200 bg-white text-xs outline-none cursor-pointer"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                >
                  <option value="0.5">0.5 yr</option>
                  <option value="1.0">1.0 yr</option>
                  <option value="1.5">1.5 yr</option>
                  <option value="2.0">2.0 yrs</option>
                  <option value="3.0">3.0 yrs</option>
                  <option value="5.0">5.0+ yrs</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
              >
                <Plus size={14} />
                Add Skill
              </button>
            </form>

            {/* List current skills */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Currently Listed Skills</span>
              {profile.skills.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">No skills listed on profile.</div>
              ) : (
                <div className="space-y-2">
                  {profile.skills.map((stdSkill, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 hover:shadow-xs transition-shadow">
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">{stdSkill.skill.skill_name}</span>
                        <span className="text-[10px] text-slate-400 block">{stdSkill.skill.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                          {stdSkill.proficiency_level}
                        </span>
                        <button 
                          onClick={() => handleDeleteSkill(stdSkill.skill_id)}
                          className="text-slate-300 hover:text-rose-500 p-1 hover:bg-rose-50 rounded"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* GitHub Sync panel */}
          {profile.github_url && (
            <div className="glass-panel p-6 rounded-3xl space-y-4 bg-gradient-to-br from-white/80 via-white/50 to-slate-50/30">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <GithubIcon size={16} />
                  <span>GitHub Integration</span>
                </span>
                {githubProfile && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </h3>

              {githubProfile ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={githubProfile.avatar_url} 
                      alt={githubProfile.name}
                      className="w-12 h-12 rounded-2xl border-2 border-pink-100 shadow-sm"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate flex items-center gap-1.5">
                        {githubProfile.name}
                        <a 
                          href={`https://github.com/${githubProfile.username}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-slate-400 hover:text-accent transition-colors"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">@{githubProfile.username}</p>
                    </div>
                  </div>

                  {githubProfile.bio && (
                    <p className="text-[11px] text-slate-500 italic bg-white/40 p-2 rounded-xl border border-slate-100/50 leading-relaxed">
                      &quot;{githubProfile.bio}&quot;
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-center bg-slate-50/60 p-2.5 rounded-2xl border border-slate-100/50">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Repos</span>
                      <span className="text-xs font-bold text-slate-800">{githubProfile.public_repos}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Followers</span>
                      <span className="text-xs font-bold text-slate-800">{githubProfile.followers}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Following</span>
                      <span className="text-xs font-bold text-slate-800">{githubProfile.following}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => syncGithub(profile.github_url!)}
                    disabled={syncing}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-600 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 transition-all border border-slate-200/50"
                  >
                    <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
                    Sync GitHub Profile
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <p className="text-xs text-slate-400">Sync with your linked GitHub account to display credentials and load badges.</p>
                  <button
                    type="button"
                    onClick={() => syncGithub(profile.github_url!)}
                    disabled={syncing}
                    className="w-full py-2 bg-accent hover:bg-rose-600 disabled:bg-rose-400 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
                    Sync profile now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Achievements list */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award size={16} />
              <span>Achievements & Badges</span>
            </h3>

            <div className="space-y-3">
              {getAchievements().map(badge => (
                <div 
                  key={badge.id}
                  className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                    badge.unlocked 
                      ? 'bg-gradient-to-r from-pink-500/5 via-rose-500/5 to-amber-500/5 border-pink-100 hover:scale-[1.02] cursor-pointer shadow-xs' 
                      : 'bg-slate-50/40 border-slate-100 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm shrink-0 ${
                    badge.unlocked 
                      ? 'bg-white border border-pink-100' 
                      : 'bg-slate-200/50 border border-slate-200 grayscale'
                  }`}>
                    {badge.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-xs">{badge.title}</h4>
                      {badge.unlocked ? (
                        <span className="text-[8px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded uppercase border border-amber-100">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded uppercase">
                          Locked
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
