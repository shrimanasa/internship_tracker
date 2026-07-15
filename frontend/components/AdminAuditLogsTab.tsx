'use client';

import { useState } from 'react';
import { 
  History, Search, Database, Calendar, 
  Terminal, ShieldCheck, User 
} from 'lucide-react';

interface AuditLog {
  audit_id: number;
  table_name: string;
  action_type: string;
  record_id: number;
  old_value?: any;
  new_value?: any;
  performed_by?: number;
  timestamp: string;
  user?: {
    full_name: string;
    email: string;
  };
}

interface AdminAuditLogsTabProps {
  logs: AuditLog[];
}

export default function AdminAuditLogsTab({ logs }: AdminAuditLogsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => {
    const table = log.table_name || '';
    const action = log.action_type || '';
    const performer = log.user?.full_name || '';
    
    return table.toLowerCase().includes(searchTerm.toLowerCase()) ||
           action.toLowerCase().includes(searchTerm.toLowerCase()) ||
           performer.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Audit Logs</h1>
        <p className="text-slate-500 mt-1">Review table edits, transaction details, and administrative updates logged by DB triggers.</p>
      </div>

      {/* Filter search bar */}
      <div className="glass-panel p-4 rounded-2xl">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></span>
          <input
            type="text"
            placeholder="Search logs by table name, action type, or user..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Audit Logs list */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Terminal size={16} />
          <span>PL/pgSQL Trigger Audit Stream</span>
        </h3>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">No audit logs found in stream.</div>
          ) : (
            filteredLogs.map((log) => (
              <div 
                key={log.audit_id}
                className="p-4.5 rounded-2xl border border-slate-200/50 bg-white/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:bg-white/80 transition-all hover:shadow-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      log.action_type === 'INSERT' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' :
                      log.action_type === 'UPDATE' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-rose-50 text-rose-500 border border-rose-100'
                    }`}>
                      {log.action_type}
                    </span>
                    <span className="font-bold text-slate-700">{log.table_name} (ID: {log.record_id})</span>
                  </div>
                  
                  {/* Values check */}
                  {log.action_type === 'UPDATE' && log.old_value && log.new_value && (
                    <div className="text-[10px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col gap-0.5 max-w-lg overflow-x-auto">
                      <div><span className="text-rose-500 font-bold">- OLD:</span> {JSON.stringify(log.old_value)}</div>
                      <div><span className="text-emerald-500 font-bold">+ NEW:</span> {JSON.stringify(log.new_value)}</div>
                    </div>
                  )}

                  {log.action_type === 'INSERT' && log.new_value && (
                    <div className="text-[10px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-lg overflow-x-auto">
                      <span className="text-emerald-500 font-bold">+ RECORD:</span> {JSON.stringify(log.new_value)}
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-2 shrink-0 md:text-right">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <User size={13} className="text-slate-400" />
                    <span className="font-semibold">{log.user?.full_name || 'System / Trigger'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <Calendar size={13} />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
