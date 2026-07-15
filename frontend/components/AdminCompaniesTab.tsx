'use client';

import { useState } from 'react';
import { 
  Building, Search, Plus, Edit2, 
  Trash2, X, AlertCircle, Link 
} from 'lucide-react';
import { api } from '../lib/api';

interface Company {
  company_id: number;
  company_name: string;
  industry?: string;
  company_size?: string;
  website_url?: string;
  linkedin_url?: string;
  headquarters?: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
}

interface AdminCompaniesTabProps {
  companies: Company[];
  onRefresh: () => void;
}

export default function AdminCompaniesTab({ companies, onRefresh }: AdminCompaniesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeComp, setActiveComp] = useState<Company | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('1000+');
  const [web, setWeb] = useState('');
  const [hq, setHq] = useState('');
  const [desc, setDesc] = useState('');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/companies', {
        company_name: name,
        industry: industry || null,
        company_size: size,
        website_url: web || null,
        headquarters: hq || null,
        description: desc || null
      });

      alert('Company added successfully!');
      setName(''); setIndustry(''); setWeb(''); setHq(''); setDesc('');
      setShowAddForm(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to add company.');
    }
  };

  const handleEditClick = (comp: Company) => {
    setActiveComp(comp);
    setName(comp.company_name);
    setIndustry(comp.industry || '');
    setSize(comp.company_size || '1000+');
    setWeb(comp.website_url || '');
    setHq(comp.headquarters || '');
    setDesc(comp.description || '');
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComp) return;
    try {
      await api.put(`/companies/${activeComp.company_id}`, {
        company_name: name,
        industry: industry || null,
        company_size: size,
        website_url: web || null,
        headquarters: hq || null,
        description: desc || null
      });

      alert('Company updated successfully!');
      setShowEditForm(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update company.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate/delete this company profile?')) return;
    try {
      await api.delete(`/companies/${id}`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting company.');
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Company Management</h1>
          <p className="text-slate-500 mt-1">Configure corporate client partners, website URLs, and industry taxonomy.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 text-sm font-semibold text-white bg-accent rounded-xl hover:bg-rose-600 transition-all shadow-md shadow-rose-100 flex items-center gap-1.5"
        >
          <Plus size={16} />
          Add Company
        </button>
      </div>

      {/* Filter search bar */}
      <div className="glass-panel p-4 rounded-2xl">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></span>
          <input
            type="text"
            placeholder="Search companies by name..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table grid of companies */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Company Name</th>
                <th className="p-4">Industry Sector</th>
                <th className="p-4">Corporate Size</th>
                <th className="p-4">Headquarters</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white/40">
              {filteredCompanies.map((c) => (
                <tr key={c.company_id} className="hover:bg-white/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{c.company_name}</td>
                  <td className="p-4">{c.industry || 'IT Services'}</td>
                  <td className="p-4 font-medium">{c.company_size || 'N/A'}</td>
                  <td className="p-4">{c.headquarters || 'India'}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                      c.is_active 
                        ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                        : 'bg-rose-50 text-rose-500 border-rose-100'
                    }`}>
                      {c.is_active ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleEditClick(c)}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(c.company_id)}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">No companies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Company Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-6">Add Corporate Client</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Razorpay"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Industry</label>
                  <input
                    type="text"
                    placeholder="Fintech"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Company Size</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                  >
                    <option value="1-50">1-50 employees</option>
                    <option value="50-250">50-250 employees</option>
                    <option value="250-1000">250-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={web}
                    onChange={e => setWeb(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Headquarters</label>
                  <input
                    type="text"
                    placeholder="Bengaluru"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={hq}
                    onChange={e => setHq(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Company Description</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none resize-none"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-sm shadow-md"
              >
                Create Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditForm && activeComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowEditForm(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-6">Edit Company Details</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Industry</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Company Size</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                  >
                    <option value="1-50">1-50 employees</option>
                    <option value="50-250">50-250 employees</option>
                    <option value="250-1000">250-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Website URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={web}
                    onChange={e => setWeb(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Headquarters</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
                    value={hq}
                    onChange={e => setHq(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Company Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none resize-none"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
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
