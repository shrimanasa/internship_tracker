'use client';

import { useState } from 'react';
import { 
  Calendar, Video, MapPin, User, Clock, 
  Plus, Edit3, Trash2, X, Check, Link 
} from 'lucide-react';
import { api } from '../lib/api';

interface Application {
  application_id: number;
  external_role_title?: string;
  external_company_name?: string;
  company: {
    company_name: string;
  };
  internship?: {
    title: string;
  };
}

interface Interview {
  interview_id: number;
  application_id: number;
  interview_round: number;
  interview_type: string;
  scheduled_start: string;
  scheduled_end: string;
  meeting_link?: string;
  location?: string;
  interviewer_name?: string;
  interview_status: string;
  preparation_notes?: string;
  feedback_notes?: string;
  result?: string;
}

interface StudentInterviewsTabProps {
  interviews: Interview[];
  applications: Application[];
  onRefresh: () => void;
}

export default function StudentInterviewsTab({ interviews, applications, onRefresh }: StudentInterviewsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeIntv, setActiveIntv] = useState<Interview | null>(null);

  // Add Form state
  const [appId, setAppId] = useState('');
  const [round, setRound] = useState('1');
  const [intvType, setIntvType] = useState('Technical');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [link, setLink] = useState('');
  const [loc, setLoc] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [prepNotes, setPrepNotes] = useState('');

  // Edit Form state
  const [editStatus, setEditStatus] = useState('Scheduled');
  const [editPrep, setEditPrep] = useState('');
  const [editFeedback, setEditFeedback] = useState('');
  const [editResult, setEditResult] = useState('Pending');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/interviews', {
        application_id: Number(appId),
        interview_round: Number(round),
        interview_type: intvType,
        scheduled_start: new Date(start).toISOString(),
        scheduled_end: new Date(end).toISOString(),
        meeting_link: link || null,
        location: loc || null,
        interviewer_name: interviewer || null,
        preparation_notes: prepNotes || null,
        interview_status: 'Scheduled',
        result: 'Pending'
      });

      alert('Interview scheduled successfully!');
      setAppId(''); setRound('1'); setStart(''); setEnd(''); setLink(''); setLoc(''); setInterviewer(''); setPrepNotes('');
      setShowAddForm(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to schedule interview.');
    }
  };

  const handleEditClick = (intv: Interview) => {
    setActiveIntv(intv);
    setEditStatus(intv.interview_status);
    setEditPrep(intv.preparation_notes || '');
    setEditFeedback(intv.feedback_notes || '');
    setEditResult(intv.result || 'Pending');
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIntv) return;
    try {
      await api.put(`/interviews/${activeIntv.interview_id}`, {
        interview_status: editStatus,
        preparation_notes: editPrep,
        feedback_notes: editFeedback,
        result: editResult
      });

      alert('Interview feedback updated!');
      setShowEditForm(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update interview.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Cancel this interview?')) return;
    try {
      await api.delete(`/interviews/${id}`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error cancelling interview.');
    }
  };

  const getApplicationLabel = (id: number) => {
    const app = applications.find(a => a.application_id === id);
    if (!app) return 'Unknown Application';
    const compName = app.external_company_name || app.company.company_name;
    const roleTitle = app.external_role_title || app.internship?.title || 'Intern';
    return `${roleTitle} at ${compName}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Interview Planner</h1>
          <p className="text-slate-500 mt-1">Manage scheduled technical rounds, coding tests, and preparation logs.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 text-sm font-semibold text-white bg-accent rounded-xl hover:bg-rose-600 transition-all shadow-md shadow-rose-100 flex items-center gap-1.5"
        >
          <Plus size={16} />
          Schedule Interview
        </button>
      </div>

      {/* Interviews list */}
      <div className="grid md:grid-cols-2 gap-6">
        {interviews.length === 0 ? (
          <div className="md:col-span-2 text-center py-20 text-slate-400 glass-panel rounded-3xl">
            <Calendar size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold">No interviews scheduled yet.</p>
          </div>
        ) : (
          interviews.map((intv) => (
            <div 
              key={intv.interview_id}
              className="glass-panel p-5 rounded-3xl space-y-4 hover:shadow-xs transition-shadow relative overflow-hidden"
            >
              {/* Status flag */}
              <div className="flex justify-between items-start">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  intv.interview_status === 'Scheduled' ? 'bg-amber-50 text-amber-500 border border-amber-100' :
                  intv.interview_status === 'Completed' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-slate-100 text-slate-500'
                }`}>
                  {intv.interview_status}
                </span>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClick(intv)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button 
                    onClick={() => handleDelete(intv.interview_id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm">{getApplicationLabel(intv.application_id)}</h4>
                <p className="text-xs text-slate-500 mt-1">Round {intv.interview_round} - {intv.interview_type} Interview</p>
              </div>

              {/* Timing */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-slate-400" />
                  <span>{new Date(intv.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  <span>{new Date(intv.scheduled_start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                {intv.interviewer_name && (
                  <div className="flex items-center gap-1.5 col-span-2 mt-1">
                    <User size={14} className="text-slate-400" />
                    <span>Interviewer: {intv.interviewer_name}</span>
                  </div>
                )}
              </div>

              {/* Links and Locations */}
              <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100">
                {intv.meeting_link ? (
                  <a 
                    href={intv.meeting_link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-accent hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Video size={13} />
                    Join Meeting
                  </a>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1"><MapPin size={13} />{intv.location || 'Online'}</span>
                )}

                {intv.result && intv.result !== 'Pending' && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    intv.result === 'Passed' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                  }`}>
                    {intv.result}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Interview Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-6">Schedule Interview Round</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Select Application</label>
                <select
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  value={appId}
                  onChange={e => setAppId(e.target.value)}
                >
                  <option value="">Choose active track...</option>
                  {applications.map(a => (
                    <option key={a.application_id} value={String(a.application_id)}>
                      {getApplicationLabel(a.application_id)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Interview Round</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={round}
                    onChange={e => setRound(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Type</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                    value={intvType}
                    onChange={e => setIntvType(e.target.value)}
                  >
                    <option value="HR">HR Round</option>
                    <option value="Technical">Technical Round</option>
                    <option value="Coding">Coding Test</option>
                    <option value="Managerial">Managerial Round</option>
                    <option value="Group Discussion">Group Discussion</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-xs focus:border-accent outline-none"
                    value={start}
                    onChange={e => setStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-xs focus:border-accent outline-none"
                    value={end}
                    onChange={e => setEnd(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Meeting Link (e.g. Google Meet)</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Interviewer Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={interviewer}
                    onChange={e => setInterviewer(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Physical Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Office Block A"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={loc}
                    onChange={e => setLoc(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Preparation Notes / Syllabus</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none resize-none"
                  value={prepNotes}
                  onChange={e => setPrepNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-md"
              >
                Track Schedule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Interview Details Modal */}
      {showEditForm && activeIntv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowEditForm(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-1">Update Interview Feedback</h3>
            <p className="text-xs text-slate-500 mb-6">{getApplicationLabel(activeIntv.application_id)}</p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Interview Status</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Result</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                    value={editResult}
                    onChange={e => setEditResult(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Preparation Notes</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-xs focus:border-accent outline-none resize-none"
                  value={editPrep}
                  onChange={e => setEditPrep(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Feedback / Interview Questions Asked</label>
                <textarea
                  rows={3}
                  placeholder="Record questions asked or general impressions..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-xs focus:border-accent outline-none resize-none"
                  value={editFeedback}
                  onChange={e => setEditFeedback(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-md"
              >
                Save Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
