'use client';

import { useState } from 'react';
import { 
  FileText, UploadCloud, Download, Trash2, 
  CheckCircle, AlertCircle, Clock, Plus 
} from 'lucide-react';
import { api, getAuthToken } from '../lib/api';

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

interface Document {
  document_id: number;
  student_id: number;
  application_id?: number;
  document_type: string;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  verification_status: string;
  uploaded_at: string;
}

interface StudentDocumentsTabProps {
  documents: Document[];
  applications: Application[];
  onRefresh: () => void;
}

export default function StudentDocumentsTab({ documents, applications, onRefresh }: StudentDocumentsTabProps) {
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('Resume');
  const [appId, setAppId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Limit client-side to 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the maximum limit of 5 MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document_type', docType);
      if (appId) {
        formData.append('application_id', appId);
      }
      formData.append('file', selectedFile);

      await api.post('/documents', formData);

      alert('Document uploaded successfully!');
      setSelectedFile(null);
      setAppId('');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete file.');
    }
  };

  const handleDownload = (doc: Document) => {
    // Navigate or trigger file download via browser download using token auth query
    const token = getAuthToken();
    const url = `http://localhost:8000/api/v1/documents/${doc.document_id}/download?token=${token}`;
    // Fetch with auth header is cleaner, but FileResponse allows simple download redirection.
    // Since we wrote standard download endpoint with Bearer auth in headers,
    // let's do a direct download or use window.open / fetch blob:
    
    // Fetch blob and trigger download in browser:
    fetch(`http://localhost:8000/api/v1/documents/${doc.document_id}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.blob())
    .then(blob => {
      const dlUrl = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = dlUrl;
      a.download = doc.original_filename;
      window.document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(() => alert('Failed to download file.'));
  };

  const getApplicationLabel = (id?: number) => {
    if (!id) return 'General Profile';
    const app = applications.find(a => a.application_id === id);
    if (!app) return 'Application Linked';
    const compName = app.external_company_name || app.company.company_name;
    const roleTitle = app.external_role_title || app.internship?.title || 'Intern';
    return `${roleTitle} at ${compName}`;
  };

  const getFileSizeString = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Documents</h1>
        <p className="text-slate-500 mt-1">Upload resumes, cover letters, transcripts, and verified certificates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Upload Form panel */}
        <div className="glass-panel p-6 rounded-3xl space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Upload Document</h3>
          
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Document Type</label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                value={docType}
                onChange={e => setDocType(e.target.value)}
              >
                <option value="Resume">Resume</option>
                <option value="Cover Letter">Cover Letter</option>
                <option value="Certificate">Certificate</option>
                <option value="Offer Letter">Offer Letter</option>
                <option value="Transcript">Transcript</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Link to Application (Optional)</label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none cursor-pointer"
                value={appId}
                onChange={e => setAppId(e.target.value)}
              >
                <option value="">General Profile Document</option>
                {applications.map(a => (
                  <option key={a.application_id} value={String(a.application_id)}>
                    {getApplicationLabel(a.application_id)}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom file selector */}
            <div className="border-2 border-dashed border-slate-200 hover:border-accent/40 rounded-2xl p-6 text-center hover:bg-slate-50/50 transition-all cursor-pointer relative group">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <UploadCloud className="mx-auto text-slate-400 group-hover:text-accent transition-colors mb-2" size={32} />
              <span className="text-xs font-bold text-slate-700 block">
                {selectedFile ? selectedFile.name : 'Select file'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {selectedFile ? getFileSizeString(selectedFile.size) : 'PDF, Word, or Image (Max 5 MB)'}
              </span>
            </div>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-full py-3 bg-accent hover:bg-rose-600 disabled:bg-rose-400 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              {uploading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                'Upload File'
              )}
            </button>
          </form>
        </div>

        {/* Uploaded Documents List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Uploaded Files</h3>

          {documents.length === 0 ? (
            <div className="text-center py-20 text-slate-400 glass-panel rounded-3xl">
              <FileText size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold">No documents uploaded yet.</p>
              <p className="text-xs text-slate-400 mt-1">Upload your resume to complete profile fields.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div 
                  key={doc.document_id}
                  className="glass-panel p-4.5 rounded-3xl hover:shadow-xs transition-shadow flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                    <FileText size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-slate-800 text-xs truncate" title={doc.original_filename}>
                      {doc.original_filename}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {doc.document_type} • {getFileSizeString(doc.file_size)}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {getApplicationLabel(doc.application_id)}
                    </p>
                    
                    {/* Verification Status badge */}
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 border ${
                      doc.verification_status === 'Verified' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                      doc.verification_status === 'Rejected' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      {doc.verification_status === 'Verified' && <CheckCircle size={10} />}
                      {doc.verification_status === 'Rejected' && <AlertCircle size={10} />}
                      {doc.verification_status === 'Pending' && <Clock size={10} />}
                      {doc.verification_status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button 
                      onClick={() => handleDownload(doc)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc.document_id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
