'use client';

import { useState } from 'react';
import { 
  Briefcase, Plus, Edit3, Trash2, X, 
  AlertTriangle, DollarSign, Calendar, MapPin, Check 
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
  source: string;
  status: string;
  company: {
    company_id: number;
    company_name: string;
  };
  required_skills: RequiredSkill[];
}

interface SkillItem {
  skill_id: number;
  skill_name: string;
  category: string;
}

interface Company {
  company_id: number;
  company_name: string;
}

interface AdminInternshipsTabProps {
  internships: Internship[];
  companies: Company[];
  masterSkills: SkillItem[];
  onRefresh: () => void;
}

export default function AdminInternshipsTab({ internships, companies, masterSkills, onRefresh }: AdminInternshipsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeInt, setActiveInt] = useState<Internship | null>(null);

  // Form states
  const [companyId, setCompanyId] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('Remote');
  const [intType, setIntType] = useState('Paid');
  const [duration, setDuration] = useState('3');
  const [stipendMin, setStipendMin] = useState('0');
  const [stipendMax, setStipendMax] = useState('15000');
  const [cgpa, setCgpa] = useState('6.0');
  const [deadline, setDeadline] = useState('');
  const [openings, setOpenings] = useState('5');
  const [source, setSource] = useState('Internal');

  // Dynamic required skills array builder
  const [skillsPayload, setSkillsPayload] = useState<any[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [importance, setImportance] = useState('Medium');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [isMandatory, setIsMandatory] = useState(false);

  const handleAddSkillToPayload = () => {
    if (!selectedSkillId) return;
    const skill = masterSkills.find(s => s.skill_id === Number(selectedSkillId));
    if (!skill) return;
    
    // Avoid duplicates in builder array
    if (skillsPayload.some(s => s.skill_id === skill.skill_id)) return;

    setSkillsPayload([
      ...skillsPayload,
      {
        skill_id: skill.skill_id,
        skill_name: skill.skill_name,
        importance_level: importance,
        minimum_proficiency: proficiency,
        is_mandatory: isMandatory
      }
    ]);
    setSelectedSkillId('');
    setIsMandatory(false);
  };

  const handleRemoveSkillFromPayload = (skillId: number) => {
    setSkillsPayload(skillsPayload.filter(s => s.skill_id !== skillId));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        company_id: Number(companyId),
        title,
        description: desc,
        location: location || 'Remote',
        work_mode: workMode,
        internship_type: intType,
        duration: Number(duration),
        stipend_min: Number(stipendMin),
        stipend_max: Number(stipendMax),
        currency: 'INR',
        eligibility_cgpa: Number(cgpa),
        application_deadline: deadline,
        number_of_openings: Number(openings),
        source,
        required_skills: skillsPayload.map(s => ({
          skill_id: s.skill_id,
          importance_level: s.importance_level,
          minimum_proficiency: s.minimum_proficiency,
          is_mandatory: s.is_mandatory
        }))
      };

      await api.post('/internships', payload);
      alert('Internship listing created successfully!');
      
      // Reset forms
      setTitle(''); setDesc(''); setLocation(''); setSkillsPayload([]);
      setShowAddForm(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to create internship.');
    }
  };

  const handleEditClick = (internship: Internship) => {
    setActiveInt(internship);
    setCompanyId(String(internship.company_id));
    setTitle(internship.title);
    setDesc(internship.description);
    setLocation(internship.location);
    setWorkMode(internship.work_mode);
    setIntType(internship.internship_type);
    setDuration(String(internship.duration));
    setStipendMin(String(internship.stipend_min));
    setStipendMax(String(internship.stipend_max));
    setCgpa(String(internship.eligibility_cgpa));
    setDeadline(internship.application_deadline.split('T')[0]);
    setOpenings(String(internship.number_of_openings));
    setSource(internship.source);

    // Map existing skills into payload builder
    setSkillsPayload(internship.required_skills.map(rs => ({
      skill_id: rs.skill_id,
      skill_name: rs.skill.skill_name,
      importance_level: rs.importance_level,
      minimum_proficiency: rs.minimum_proficiency,
      is_mandatory: rs.is_mandatory
    })));

    setShowEditForm(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInt) return;
    try {
      const payload = {
        title,
        description: desc,
        location,
        work_mode: workMode,
        internship_type: intType,
        duration: Number(duration),
        stipend_min: Number(stipendMin),
        stipend_max: Number(stipendMax),
        eligibility_cgpa: Number(cgpa),
        application_deadline: deadline,
        number_of_openings: Number(openings),
        source,
        required_skills: skillsPayload.map(s => ({
          skill_id: s.skill_id,
          importance_level: s.importance_level,
          minimum_proficiency: s.minimum_proficiency,
          is_mandatory: s.is_mandatory
        }))
      };

      await api.put(`/internships/${activeInt.internship_id}`, payload);
      alert('Internship updated successfully!');
      setShowEditForm(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update internship.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this internship listing?')) return;
    try {
      await api.delete(`/internships/${id}`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to deactivate internship.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Internship Creator</h1>
          <p className="text-slate-500 mt-1">Publish job postings, configure GPA restrictions, and map required skills.</p>
        </div>
        <button 
          onClick={() => { setSkillsPayload([]); setShowAddForm(true); }}
          className="px-4 py-2.5 text-sm font-semibold text-white bg-accent rounded-xl hover:bg-rose-600 transition-all shadow-md shadow-rose-100 flex items-center gap-1.5"
        >
          <Plus size={16} />
          Create Posting
        </button>
      </div>

      {/* Internships grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((item) => (
          <div key={item.internship_id} className="glass-panel p-5 rounded-3xl flex flex-col justify-between hover:shadow-xs transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block">{item.company.company_name}</span>
                  <h4 className="font-bold text-slate-800 text-sm mt-0.5 leading-tight">{item.title}</h4>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEditClick(item)} className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-600">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.internship_id)} className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={13} className="text-slate-400" />
                  <span>{item.duration} Months</span>
                </div>
                <div className="flex items-center gap-1 col-span-2">
                  <DollarSign size={13} className="text-slate-400" />
                  <span>CGPA Req: {item.eligibility_cgpa}</span>
                </div>
              </div>

              {/* Required Skills badges */}
              <div className="flex flex-wrap gap-1">
                {item.required_skills.map((rs, idx) => (
                  <span key={idx} className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                    rs.is_mandatory ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                  }`}>
                    {rs.skill.skill_name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-3.5 border-t border-slate-100 flex justify-between items-center mt-5 text-[10px] text-slate-400">
              <span>Source: {item.source}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                item.status === 'Open' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'
              }`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-6">Create Internship Position</h3>

            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Company Host</label>
                  <select
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={companyId}
                    onChange={e => setCompanyId(e.target.value)}
                  >
                    <option value="">Select company...</option>
                    {companies.map(c => <option key={c.company_id} value={String(c.company_id)}>{c.company_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SDE Intern"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Job Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Paste details of the role..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none resize-none"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Bengaluru"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Work Mode</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={workMode}
                    onChange={e => setWorkMode(e.target.value)}
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Type</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={intType}
                    onChange={e => setIntType(e.target.value)}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Performance-based">Performance-based</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Duration (M)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Stipend Max</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm"
                    value={stipendMax}
                    onChange={e => setStipendMax(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">GPA Cut-off</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm"
                    value={cgpa}
                    onChange={e => setCgpa(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Openings</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm"
                    value={openings}
                    onChange={e => setOpenings(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Source</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm"
                    value={source}
                    onChange={e => setSource(e.target.value)}
                  >
                    <option value="Internal">Internal (College Team)</option>
                    <option value="External">External Portal</option>
                  </select>
                </div>
              </div>

              {/* Skills section builder */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Configure Required Skills</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 items-end">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Skill</label>
                    <select
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none cursor-pointer"
                      value={selectedSkillId}
                      onChange={e => setSelectedSkillId(e.target.value)}
                    >
                      <option value="">Select skill...</option>
                      {masterSkills.map(s => <option key={s.skill_id} value={String(s.skill_id)}>{s.skill_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Importance</label>
                    <select
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none cursor-pointer"
                      value={importance}
                      onChange={e => setImportance(e.target.value)}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSkillToPayload}
                    className="py-1.5 bg-accent hover:bg-rose-600 text-white font-semibold rounded-lg text-xs"
                  >
                    Add
                  </button>
                </div>

                {/* Display added builder items */}
                <div className="flex flex-wrap gap-1.5">
                  {skillsPayload.map((s, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 text-[10px] bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full font-medium shadow-xs">
                      <span>{s.skill_name} ({s.importance_level})</span>
                      <X size={12} className="text-slate-400 hover:text-rose-500 cursor-pointer" onClick={() => handleRemoveSkillFromPayload(s.skill_id)} />
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-md"
              >
                Create Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditForm && activeInt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setShowEditForm(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-6">Modify Position Details</h3>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Job Description</label>
                <textarea
                  rows={3}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none resize-none"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Work Mode</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={workMode}
                    onChange={e => setWorkMode(e.target.value)}
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Type</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={intType}
                    onChange={e => setIntType(e.target.value)}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Performance-based">Performance-based</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Duration (M)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Stipend Max</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm"
                    value={stipendMax}
                    onChange={e => setStipendMax(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">GPA Cut-off</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm"
                    value={cgpa}
                    onChange={e => setCgpa(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Openings</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm"
                    value={openings}
                    onChange={e => setOpenings(e.target.value)}
                  />
                </div>
              </div>

              {/* Skills section builder */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Configure Required Skills</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 items-end">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Skill</label>
                    <select
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none cursor-pointer"
                      value={selectedSkillId}
                      onChange={e => setSelectedSkillId(e.target.value)}
                    >
                      <option value="">Select skill...</option>
                      {masterSkills.map(s => <option key={s.skill_id} value={String(s.skill_id)}>{s.skill_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Importance</label>
                    <select
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none cursor-pointer"
                      value={importance}
                      onChange={e => setImportance(e.target.value)}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSkillToPayload}
                    className="py-1.5 bg-accent hover:bg-rose-600 text-white font-semibold rounded-lg text-xs"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {skillsPayload.map((s, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 text-[10px] bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full font-medium shadow-xs">
                      <span>{s.skill_name} ({s.importance_level})</span>
                      <X size={12} className="text-slate-400 hover:text-rose-500 cursor-pointer" onClick={() => handleRemoveSkillFromPayload(s.skill_id)} />
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-md"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
