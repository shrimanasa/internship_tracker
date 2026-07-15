'use client';

import { useState } from 'react';
import { 
  Bell, Clock, Calendar, CheckSquare, Square, 
  Trash2, Plus, X, AlertTriangle 
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

interface Reminder {
  reminder_id: number;
  student_id: number;
  application_id?: number;
  title: string;
  description?: string;
  reminder_datetime: string;
  reminder_type: string;
  is_completed: boolean;
  created_at: string;
}

interface StudentRemindersTabProps {
  reminders: Reminder[];
  applications: Application[];
  onRefresh: () => void;
}

export default function StudentRemindersTab({ reminders, applications, onRefresh }: StudentRemindersTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [datetime, setDatetime] = useState('');
  const [type, setType] = useState('Deadline');
  const [appId, setAppId] = useState('');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reminders', {
        title,
        description: desc || null,
        reminder_datetime: new Date(datetime).toISOString(),
        reminder_type: type,
        application_id: appId ? Number(appId) : null
      });

      alert('Reminder scheduled!');
      setTitle(''); setDesc(''); setDatetime(''); setType('Deadline'); setAppId('');
      setShowAddForm(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to create reminder.');
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await api.post(`/reminders/${id}/complete`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error updating reminder.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/reminders/${id}`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to remove reminder.');
    }
  };

  const getApplicationLabel = (id?: number) => {
    if (!id) return '';
    const app = applications.find(a => a.application_id === id);
    if (!app) return '';
    const compName = app.external_company_name || app.company.company_name;
    const roleTitle = app.external_role_title || app.internship?.title || 'Internship';
    return `Linked: ${roleTitle} at ${compName}`;
  };

  const getReminderStatusBadge = (rem: Reminder) => {
    if (rem.is_completed) {
      return (
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100">
          Completed
        </span>
      );
    }
    
    const isOverdue = new Date(rem.reminder_datetime) < new Date();
    if (isOverdue) {
      return (
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 border border-rose-100">
          Overdue
        </span>
      );
    }

    return (
      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
        Upcoming
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reminders</h1>
          <p className="text-slate-500 mt-1">Set notifications for follow-up emails, interview prep, and offer letter deadlines.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 text-sm font-semibold text-white bg-accent rounded-xl hover:bg-rose-600 transition-all shadow-md shadow-rose-100 flex items-center gap-1.5"
        >
          <Plus size={16} />
          Create Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Reminders List - 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">My Schedule</h3>

          {reminders.length === 0 ? (
            <div className="text-center py-20 text-slate-400 glass-panel rounded-3xl">
              <Bell size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold">No reminders found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((rem) => (
                <div 
                  key={rem.reminder_id}
                  className={`glass-panel p-4.5 rounded-3xl hover:shadow-xs transition-shadow flex items-start gap-4 ${
                    rem.is_completed ? 'opacity-65' : ''
                  }`}
                >
                  <button 
                    onClick={() => handleToggleComplete(rem.reminder_id)}
                    className="text-slate-400 hover:text-accent p-1 transition-colors mt-0.5 shrink-0"
                  >
                    {rem.is_completed ? (
                      <CheckSquare size={20} className="text-accent" />
                    ) : (
                      <Square size={20} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div>
                      <h4 className={`font-bold text-slate-800 text-sm leading-tight ${rem.is_completed ? 'line-through' : ''}`}>
                        {rem.title}
                      </h4>
                      {rem.description && (
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rem.description}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} />
                        <span>{new Date(rem.reminder_datetime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={13} />
                        <span>{new Date(rem.reminder_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-rose-400">{rem.reminder_type}</span>
                    </div>

                    {rem.application_id && (
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                        {getApplicationLabel(rem.application_id)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 items-end shrink-0 ml-4">
                    {getReminderStatusBadge(rem)}
                    <button 
                      onClick={() => handleDelete(rem.reminder_id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="glass-panel p-6 rounded-3xl bg-slate-900 border-slate-800 text-slate-300">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Database Reminders</h3>
          <p className="text-xs leading-relaxed text-slate-400">
            Reminders are mapped directly to student profiles and status tracking. The DBMS upcoming events view automatically aggregates deadline alerts, interview sessions, and follow-up notes for student and administrative dashboards.
          </p>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-6">Create Personal Reminder</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Reminder Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Email Razorpay HR"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none resize-none"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-xs focus:border-accent outline-none"
                    value={datetime}
                    onChange={e => setDatetime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Reminder Category</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    <option value="Deadline">Deadline</option>
                    <option value="Interview">Interview Prep</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Link to Application (Optional)</label>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                  value={appId}
                  onChange={e => setAppId(e.target.value)}
                >
                  <option value="">General Reminder</option>
                  {applications.map(a => (
                    <option key={a.application_id} value={String(a.application_id)}>
                      {getApplicationLabel(a.application_id)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-md"
              >
                Schedule reminder
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
