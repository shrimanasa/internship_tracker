'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, BookOpen, Layers, Plus, Trash2, 
  Linkedin, Github, Globe, Check, AlertCircle, Save 
} from 'lucide-react';
import { api } from '../lib/api';

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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0077b5]"><Linkedin size={16} /></span>
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    {...register('linkedin_url')}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#24292e]"><Github size={16} /></span>
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
        </div>
      </div>
    </div>
  );
}
