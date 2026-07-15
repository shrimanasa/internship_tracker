'use client';

import { 
  Download, FileSpreadsheet, Layers, Award, 
  HelpCircle, AlertCircle, Database, CheckSquare 
} from 'lucide-react';
import { getAuthToken } from '../lib/api';

export default function AdminReportsTab() {
  const triggerCSVDownload = (endpoint: string, filename: string) => {
    const token = getAuthToken();
    if (!token) return;

    fetch(`http://localhost:8000/api/v1/admin/reports/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Network response not ok.');
      return res.blob();
    })
    .then(blob => {
      const dlUrl = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = dlUrl;
      a.download = filename;
      window.document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(() => alert('Failed to download CSV report. Check database status.'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Placement Reports</h1>
        <p className="text-slate-500 mt-1">Export custom CSV spreadsheets, student skill-gap analysis, and corporate placement matrices.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Placement report card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-500 flex items-center justify-center">
              <Award size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Placed Students Spreadsheet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export all registered student offers, companies, stipends, joining dates, and contact profiles in CSV spreadsheet format.
            </p>
          </div>
          
          <button 
            onClick={() => triggerCSVDownload('placements/csv', 'interntrack_placement_report.csv')}
            className="w-full py-2.5 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
          >
            <Download size={14} />
            Export Placement CSV
          </button>
        </div>

        {/* Applications report card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center">
              <FileSpreadsheet size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Application Pipeline Logs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export all college application records (including external manual tracks) with their current pipeline stages, deadlines, and history.
            </p>
          </div>
          
          <button 
            onClick={() => triggerCSVDownload('applications/csv', 'interntrack_applications_report.csv')}
            className="w-full py-2.5 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
          >
            <Download size={14} />
            Export Pipeline CSV
          </button>
        </div>

        {/* Skill gaps report card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-500 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Skill Gap Analysis</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export corporate skill-demand matrices vs student skill-gap analysis. Identifies missing tags to target workshop syllabuses.
            </p>
          </div>
          
          <button 
            onClick={() => triggerCSVDownload('skill-gaps/csv', 'interntrack_skill_gaps_report.csv')}
            className="w-full py-2.5 bg-accent hover:bg-rose-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
          >
            <Download size={14} />
            Export Skill Gaps CSV
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 flex gap-3">
        <AlertCircle size={20} className="text-rose-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-white uppercase block mb-1">DBMS System Reports</span>
          <p className="text-slate-400">
            CSV exports execute SQL aggregates inside PostgreSQL using JOINs, Window Functions, and subqueries to output consistent relational state. Safe for audit validations.
          </p>
        </div>
      </div>
    </div>
  );
}
