'use client';

import { useState } from 'react';
import { 
  Plus, Calendar, MapPin, DollarSign, Clock, 
  Trash2, Archive, Edit2, AlertCircle, Check, X,
  ExternalLink, Layers, ArrowRight, Grid, List 
} from 'lucide-react';
import { api } from '../lib/api';
import { showToast } from '@/lib/toast';

interface Company {
  company_id: number;
  company_name: string;
}

interface Internship {
  internship_id: number;
  title: string;
  location: string;
}

interface Application {
  application_id: number;
  student_id: number;
  internship_id?: number;
  company_id: number;
  external_company_name?: string;
  external_role_title?: string;
  application_source: string;
  applied_date: string;
  current_status: string;
  priority: string;
  application_url?: string;
  job_reference_id?: string;
  expected_stipend: number;
  notes?: string;
  next_action?: string;
  next_action_date?: string;
  is_archived: boolean;
  company: Company;
  internship?: Internship;
}

interface StudentApplicationsTabProps {
  applications: Application[];
  companies: Company[];
  onRefresh: () => void;
}

const STATUS_COLUMNS = [
  'Interested',
  'Applied',
  'Under Review',
  'Online Assessment',
  'Interview Scheduled',
  'Offer Received',
  'Rejected'
];

export default function StudentApplicationsTab({ applications, companies, onRefresh }: StudentApplicationsTabProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeApp, setActiveApp] = useState<Application | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Add Manual Application form states
  const [isExternal, setIsExternal] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [extCompany, setExtCompany] = useState('');
  const [extRole, setExtRole] = useState('');
  const [appSource, setAppSource] = useState('LinkedIn');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appStatus, setAppStatus] = useState('Interested');
  const [priority, setPriority] = useState('Medium');
  const [appUrl, setAppUrl] = useState('');
  const [expectedStipend, setExpectedStipend] = useState('');
  const [notes, setNotes] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [nextActionDate, setNextActionDate] = useState('');

  // Edit form states
  const [editStatus, setEditStatus] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editStipend, setEditStipend] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editAction, setEditAction] = useState('');
  const [editActionDate, setEditActionDate] = useState('');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/applications', {
        company_id: Number(selectedCompanyId),
        external_company_name: extCompany || null,
        external_role_title: extRole || null,
        application_source: appSource,
        applied_date: appliedDate,
        current_status: appStatus,
        priority: priority,
        application_url: appUrl || null,
        expected_stipend: expectedStipend ? Number(expectedStipend) : 0,
        notes: notes || null,
        next_action: nextAction || null,
        next_action_date: nextActionDate || null
      });

      showToast({ message: 'Application tracked successfully!', type: 'success' });
      // Reset form fields
      setSelectedCompanyId(''); setExtCompany(''); setExtRole(''); setNotes(''); setNextAction(''); setNextActionDate('');
      setShowAddModal(false);
      onRefresh();
    } catch (err: any) {
      showToast({ message: err.message || 'Error tracking application.', type: 'error' });
    }
  };

  const handleEditClick = (app: Application) => {
    setActiveApp(app);
    setEditStatus(app.current_status);
    setEditPriority(app.priority);
    setEditStipend(String(app.expected_stipend));
    setEditNotes(app.notes || '');
    setEditAction(app.next_action || '');
    setEditActionDate(app.next_action_date || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApp) return;
    try {
      await api.put(`/applications/${activeApp.application_id}`, {
        current_status: editStatus,
        priority: editPriority,
        expected_stipend: Number(editStipend),
        notes: editNotes,
        next_action: editAction,
        next_action_date: editActionDate || null
      });

      showToast({ message: 'Application updated successfully!', type: 'success' });
      setShowEditModal(false);
      onRefresh();
    } catch (err: any) {
      showToast({ message: err.message || 'Error updating application.', type: 'error' });
    }
  };

  const handleArchive = async (id: number) => {
    if (!confirm('Are you sure you want to archive this application track?')) return;
    try {
      await api.post(`/applications/${id}/archive`);
      onRefresh();
    } catch (err: any) {
      showToast({ message: err.message || 'Error archiving application.', type: 'error' });
    }
  };

  const filteredApps = applications.filter(app => {
    const matchStatus = statusFilter ? app.current_status === statusFilter : true;
    const matchPriority = priorityFilter ? app.priority === priorityFilter : true;
    return matchStatus && matchPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header and Toggle view controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Application Pipeline</h1>
          <p className="text-slate-500 mt-1">Organize and update status history for all internal and external tracks.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Kanban Board View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Table view"
            >
              <List size={16} />
            </button>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-accent rounded-xl hover:bg-rose-600 transition-all shadow-md shadow-rose-100 flex items-center gap-1.5"
          >
            <Plus size={16} />
            Add Application
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row gap-4">
        <select
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-xs outline-none cursor-pointer w-full sm:w-auto"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUS_COLUMNS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-xs outline-none cursor-pointer w-full sm:w-auto"
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 max-w-full items-start">
          {STATUS_COLUMNS.map((col) => {
            const colApps = filteredApps.filter(app => app.current_status === col);
            return (
              <div key={col} className="w-72 bg-slate-100/50 rounded-2xl border border-slate-200/40 p-4 shrink-0 flex flex-col max-h-[70vh]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{col}</h3>
                  <span className="text-[10px] font-bold bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-full">{colApps.length}</span>
                </div>
                
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {colApps.map((app) => {
                    const companyName = app.external_company_name || app.company.company_name;
                    const roleTitle = app.external_role_title || app.internship?.title || 'Internship';
                    return (
                      <div 
                        key={app.application_id}
                        onClick={() => handleEditClick(app)}
                        className="bg-white p-4 rounded-xl border border-slate-200/50 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer space-y-3"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs leading-tight line-clamp-2">{roleTitle}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{companyName}</p>
                          </div>
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            app.priority === 'High' ? 'bg-rose-50 text-rose-500' :
                            app.priority === 'Medium' ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {app.priority}
                          </span>
                        </div>

                        {app.next_action && (
                          <div className="text-[9px] text-amber-600 bg-amber-50/50 p-2 rounded-lg border border-amber-100/40 flex flex-col gap-0.5">
                            <span className="font-bold uppercase tracking-wide">Next: {app.next_action}</span>
                            {app.next_action_date && <span>Due: {new Date(app.next_action_date).toLocaleDateString()}</span>}
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
                          <span>Source: {app.application_source}</span>
                          <span className="flex items-center gap-1">
                            <Archive size={11} className="hover:text-rose-500 transition-colors" onClick={(e) => { e.stopPropagation(); handleArchive(app.application_id); }} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {colApps.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-[11px] border border-dashed border-slate-200 rounded-xl">
                      No applications.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="glass-panel rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Role & Company</th>
                  <th className="p-4">Date Applied</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Stipend</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white/40">
                {filteredApps.map((app) => {
                  const companyName = app.external_company_name || app.company.company_name;
                  const roleTitle = app.external_role_title || app.internship?.title || 'Internship';
                  return (
                    <tr key={app.application_id} className="hover:bg-white/50 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-slate-800 block">{roleTitle}</span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">{companyName} ({app.application_source})</span>
                      </td>
                      <td className="p-4">{new Date(app.applied_date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          {app.current_status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          app.priority === 'High' ? 'bg-rose-50 text-rose-500' :
                          app.priority === 'Medium' ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {app.priority}
                        </span>
                      </td>
                      <td className="p-4">{app.expected_stipend > 0 ? `${app.expected_stipend} INR` : 'Unspecified'}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleEditClick(app)}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleArchive(app.application_id)}
                            className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                          >
                            <Archive size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">No applications tracked.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Manual Track Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-6">Track New Internship</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Source Type</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={isExternal ? 'ext' : 'int'}
                    onChange={e => setIsExternal(e.target.value === 'ext')}
                  >
                    <option value="ext">External Portal Application</option>
                    <option value="int">Listed Company in Database</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Company Select</label>
                  <select
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={selectedCompanyId}
                    onChange={e => setSelectedCompanyId(e.target.value)}
                  >
                    <option value="">Select Company...</option>
                    {companies.map(c => <option key={c.company_id} value={String(c.company_id)}>{c.company_name}</option>)}
                  </select>
                </div>
              </div>

              {isExternal && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-100 p-3 rounded-2xl bg-slate-50">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">External Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Swiggy"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:border-accent outline-none"
                      value={extCompany}
                      onChange={e => setExtCompany(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">External Role Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Frontend Intern"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:border-accent outline-none"
                      value={extRole}
                      onChange={e => setExtRole(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Application Source</label>
                  <input
                    type="text"
                    placeholder="LinkedIn, Referral"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={appSource}
                    onChange={e => setAppSource(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Date Applied</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={appliedDate}
                    onChange={e => setAppliedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Current Status</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                    value={appStatus}
                    onChange={e => setAppStatus(e.target.value)}
                  >
                    <option value="Interested">Interested</option>
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Online Assessment">Online Assessment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Expected Stipend</label>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={expectedStipend}
                    onChange={e => setExpectedStipend(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Application URL</label>
                  <input
                    type="url"
                    placeholder="https://career.link"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={appUrl}
                    onChange={e => setAppUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Next Follow-up Action</label>
                  <input
                    type="text"
                    placeholder="Check status email"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={nextAction}
                    onChange={e => setNextAction(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={nextActionDate}
                    onChange={e => setNextActionDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Notes / Logs</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none resize-none"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-md transition-all"
              >
                Track Position
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {showEditModal && activeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowEditModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-1">Update Status Track</h3>
            <p className="text-xs text-slate-500 mb-6">
              {activeApp.external_role_title || activeApp.internship?.title || 'Internship'}
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Update Status</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                  >
                    <option value="Interested">Interested</option>
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Online Assessment">Online Assessment</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Interview Completed">Interview Completed</option>
                    <option value="Offer Received">Offer Received</option>
                    <option value="Offer Accepted">Offer Accepted</option>
                    <option value="Offer Declined">Offer Declined</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                    value={editPriority}
                    onChange={e => setEditPriority(e.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Expected Stipend</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={editStipend}
                    onChange={e => setEditStipend(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={editActionDate}
                    onChange={e => setEditActionDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Next Action Required</label>
                <input
                  type="text"
                  placeholder="Check portal status"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  value={editAction}
                  onChange={e => setEditAction(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Status Log Notes</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none resize-none"
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-md transition-all"
              >
                Save Updates
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
