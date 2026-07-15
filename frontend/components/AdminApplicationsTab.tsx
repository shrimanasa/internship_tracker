'use client';

import { useState } from 'react';
import { 
  Layers, Search, Edit3, X, Eye, 
  Clock, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { api } from '../lib/api';

interface Student {
  full_name: string;
  register_number: string;
  department: {
    department_code: string;
  };
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
  expected_stipend: number;
  notes?: string;
  student: Student;
  company: {
    company_name: string;
  };
  internship?: {
    title: string;
  };
}

interface AdminApplicationsTabProps {
  applications: Application[];
  onRefresh: () => void;
}

export default function AdminApplicationsTab({ applications, onRefresh }: AdminApplicationsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeApp, setActiveApp] = useState<Application | null>(null);

  // Status updates states
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  const handleEditClick = (app: Application) => {
    setActiveApp(app);
    setNewStatus(app.current_status);
    setNotes(app.notes || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApp) return;
    try {
      await api.put(`/admin/applications/${activeApp.application_id}/status`, {
        status: newStatus,
        remarks: notes
      });

      alert('Application status updated!');
      setShowEditModal(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update application status.');
    }
  };

  const filteredApps = applications.filter(app => {
    const studentName = app.student?.full_name || '';
    const registerNum = app.student?.register_number || '';
    const companyName = app.external_company_name || app.company?.company_name || '';
    
    const matchSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        registerNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter ? app.current_status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Application Records</h1>
        <p className="text-slate-500 mt-1">Review student applications, verify statuses, and log administrative notes.</p>
      </div>

      {/* Filters Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></span>
          <input
            type="text"
            placeholder="Search by student, register number, or company..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-xs outline-none cursor-pointer"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Online Assessment">Online Assessment</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Offer Received">Offer Received</option>
            <option value="Offer Accepted">Offer Accepted</option>
            <option value="Offer Declined">Offer Declined</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Student</th>
                <th className="p-4">Role & Company</th>
                <th className="p-4">Date Applied</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white/40">
              {filteredApps.map((app) => {
                const companyName = app.external_company_name || app.company?.company_name;
                const roleTitle = app.external_role_title || app.internship?.title || 'Internship';
                return (
                  <tr key={app.application_id} className="hover:bg-white/50 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-800 block">{app.student?.full_name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{app.student?.register_number} ({app.student?.department?.department_code})</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 block">{roleTitle}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{companyName} ({app.application_source})</span>
                    </td>
                    <td className="p-4">{new Date(app.applied_date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        {app.current_status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleEditClick(app)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 rounded-lg hover:shadow-xs transition-all flex items-center gap-1 mx-auto"
                      >
                        <Edit3 size={12} />
                        Update Status
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">No student applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

            <h3 className="text-lg font-bold text-slate-800 mb-1 font-mono">Update Status History</h3>
            <p className="text-xs text-slate-500 mb-6">
              Student: {activeApp.student?.full_name} ({activeApp.student?.register_number})
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Set Application Stage</label>
                <select
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                >
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Online Assessment">Online Assessment</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Interview Completed">Interview Completed</option>
                  <option value="Offer Received">Offer Received</option>
                  <option value="Offer Accepted">Offer Accepted</option>
                  <option value="Offer Declined">Offer Declined</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Remarks / Feedback Comments</label>
                <textarea
                  rows={3}
                  placeholder="Provide internal feedback or reason for status update..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none resize-none"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-md"
              >
                Save status track update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
