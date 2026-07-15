'use client';

import { useState } from 'react';
import { 
  Search, MapPin, Briefcase, Calendar, 
  Sparkles, CheckCircle, AlertTriangle, Bookmark, BookmarkCheck,
  Building, DollarSign, X, Check, ExternalLink 
} from 'lucide-react';
import { api } from '../lib/api';

interface RequiredSkill {
  internship_skill_id: number;
  internship_id: number;
  skill_id: number;
  importance_level: string;
  minimum_proficiency: string;
  is_mandatory: boolean;
  skill: {
    skill_name: string;
    category: string;
  };
}

interface SkillMatch {
  match_percentage: number;
  eligible: boolean;
  matched_skills: string[];
  missing_skills: string[];
  proficiency_gaps: Array<{
    skill_name: string;
    required: string;
    student: string;
  }>;
}

interface Internship {
  internship_id: number;
  company_id: number;
  title: string;
  description: string;
  location: string;
  work_mode: string;
  internship_type: string;
  duration: number;
  stipend_min: number;
  stipend_max: number;
  currency: string;
  eligibility_cgpa: number;
  application_deadline: string;
  number_of_openings: number;
  application_url?: string;
  source: string;
  status: string;
  company: {
    company_id: number;
    company_name: string;
    industry: string;
    logo_url?: string;
  };
  required_skills: RequiredSkill[];
  skill_match?: SkillMatch;
}

interface StudentExplorerTabProps {
  internships: Internship[];
  savedIds: number[];
  onRefresh: () => void;
}

export default function StudentExplorerTab({ internships, savedIds, onRefresh }: StudentExplorerTabProps) {
  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  // Selected internship for detailed modal view
  const [activeInt, setActiveInt] = useState<Internship | null>(null);

  // Application submission form state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [expectedStipend, setExpectedStipend] = useState('');
  const [applyNotes, setApplyNotes] = useState('');

  const isSaved = (id: number) => savedIds.includes(id);

  const handleSaveToggle = async (internshipId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isSaved(internshipId)) {
        await api.delete(`/internships/${internshipId}/unsave`);
      } else {
        await api.post(`/internships/${internshipId}/save`);
      }
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error updating saved state.');
    }
  };

  const handleApplyClick = (internship: Internship) => {
    setActiveInt(internship);
    setShowApplyModal(true);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInt) return;

    try {
      await api.post('/applications', {
        internship_id: activeInt.internship_id,
        company_id: activeInt.company_id,
        application_source: activeInt.source,
        applied_date: new Date().toISOString().split('T')[0],
        current_status: 'Applied',
        expected_stipend: expectedStipend ? Number(expectedStipend) : 0,
        notes: applyNotes
      });

      alert('Application submitted successfully!');
      setShowApplyModal(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Could not submit application.');
    }
  };

  // Filter internships locally
  const filteredList = internships.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.company.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = selectedMode ? item.work_mode === selectedMode : true;
    const matchesType = selectedType ? item.internship_type === selectedType : true;
    return matchesSearch && matchesMode && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Internship Explorer</h1>
          <p className="text-slate-500 mt-1">Discover available postings, calculate matches, and submit applications.</p>
        </div>
      </div>

      {/* Filters Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></span>
          <input
            type="text"
            placeholder="Search roles or companies..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-xs outline-none cursor-pointer"
            value={selectedMode}
            onChange={e => setSelectedMode(e.target.value)}
          >
            <option value="">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <select
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-xs outline-none cursor-pointer"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Performance-based">Performance-based</option>
          </select>
        </div>
      </div>

      {/* Internship Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Briefcase size={40} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-semibold">No internships matching your filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <div 
              key={item.internship_id}
              onClick={() => setActiveInt(item)}
              className="glass-panel p-5 rounded-3xl glass-panel-hover flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 uppercase text-xs">
                      {item.company.company_name.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight truncate max-w-[150px]">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[150px]">{item.company.company_name}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleSaveToggle(item.internship_id, e)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-50 rounded-lg"
                  >
                    {isSaved(item.internship_id) ? (
                      <BookmarkCheck size={18} className="text-rose-500 fill-rose-500" />
                    ) : (
                      <Bookmark size={18} />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-slate-500 mb-5">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{item.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={14} className="text-slate-400" />
                    <span>{item.work_mode}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <DollarSign size={14} className="text-slate-400" />
                    <span>Stipend: {item.stipend_max} {item.currency}</span>
                  </div>
                </div>

                {/* Skills tags summary */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.required_skills.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {s.skill.skill_name}
                    </span>
                  ))}
                  {item.required_skills.length > 3 && (
                    <span className="text-[9px] text-slate-400 px-1 py-0.5">+ {item.required_skills.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex justify-between items-center mt-auto">
                {/* Skill Match Indicator */}
                {item.skill_match ? (
                  <div className="flex items-center gap-1">
                    <Sparkles size={13} className="text-rose-500" />
                    <span className="text-[11px] font-bold text-slate-700">
                      {item.skill_match.match_percentage}% match
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400">Sign in to match</span>
                )}

                {item.skill_match?.eligible ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Check size={10} />
                    Eligible
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <AlertTriangle size={10} />
                    Not Eligible
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Internship Details Modal */}
      {activeInt && !showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setActiveInt(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-4 pb-6 border-b border-slate-100 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                {activeInt.company.company_name.slice(0, 2)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{activeInt.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{activeInt.company.company_name} • {activeInt.company.industry}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                    {activeInt.work_mode}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                    {activeInt.internship_type}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 mb-6">
              <h4 className="font-bold text-slate-800 text-sm">Job Description</h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{activeInt.description}</p>
            </div>

            {/* Meta stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
              <div>
                <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wide">Duration</span>
                <span className="text-xs font-bold text-slate-700 mt-0.5">{activeInt.duration} Months</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wide">Eligibility CGPA</span>
                <span className="text-xs font-bold text-slate-700 mt-0.5">{activeInt.eligibility_cgpa}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wide">Max Stipend</span>
                <span className="text-xs font-bold text-slate-700 mt-0.5">{activeInt.stipend_max} {activeInt.currency}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wide">Deadline</span>
                <span className="text-xs font-bold text-slate-700 mt-0.5">
                  {new Date(activeInt.application_deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Matching analysis */}
            {activeInt.skill_match && (
              <div className="space-y-4 mb-6 p-5 border border-rose-100 rounded-3xl bg-rose-50/20">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                    <Sparkles size={16} className="text-rose-500" />
                    <span>Database Matching Analytics</span>
                  </h4>
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                    {activeInt.skill_match.match_percentage}% Score
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {activeInt.skill_match.matched_skills.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-600 block mb-1">Matched Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {activeInt.skill_match.matched_skills.map((s, idx) => (
                          <span key={idx} className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeInt.skill_match.proficiency_gaps.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-600 block mb-1">Proficiency Gaps (Needs Upgrade):</span>
                      <div className="space-y-1">
                        {activeInt.skill_match.proficiency_gaps.map((g, idx) => (
                          <div key={idx} className="text-amber-600 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span>{g.skill_name}: Required <strong className="font-bold">{g.required}</strong>, you have <strong className="font-bold">{g.student}</strong></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeInt.skill_match.missing_skills.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-600 block mb-1">Missing Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {activeInt.skill_match.missing_skills.map((s, idx) => (
                          <span key={idx} className="bg-rose-50/50 text-rose-500 px-2 py-0.5 rounded border border-rose-100/50 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={(e) => handleSaveToggle(activeInt.internship_id, e)}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
              >
                {isSaved(activeInt.internship_id) ? 'Saved' : 'Save Position'}
              </button>
              
              <button
                onClick={() => handleApplyClick(activeInt)}
                className="px-6 py-2.5 text-xs font-bold text-white bg-accent hover:bg-rose-600 rounded-xl shadow-md flex items-center gap-1"
              >
                Apply for Position
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && activeInt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowApplyModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-1">Apply for Internship</h3>
            <p className="text-xs text-slate-500 mb-6">{activeInt.title} at {activeInt.company.company_name}</p>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Expected Stipend (INR / Month)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  value={expectedStipend}
                  onChange={e => setExpectedStipend(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Cover Note / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Write a brief cover note for your application..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none resize-none"
                  value={applyNotes}
                  onChange={e => setApplyNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
