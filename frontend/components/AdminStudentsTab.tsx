'use client';

import { useState } from 'react';
import { 
  Search, Users, BookOpen, Layers, 
  MapPin, CheckCircle, XCircle, ChevronRight, X 
} from 'lucide-react';
import { api } from '../lib/api';

interface Student {
  student_id: number;
  user_id: number;
  register_number: string;
  department_id: number;
  phone_number?: string;
  graduation_year: number;
  current_semester: number;
  cgpa: number;
  location?: string;
  preferred_work_mode?: string;
  preferred_roles?: string;
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  profile_completion_percentage: number;
  user: {
    user_id: number;
    full_name: string;
    email: string;
    is_active: boolean;
  };
  department: {
    department_name: string;
    department_code: string;
  };
}

interface AdminStudentsTabProps {
  students: Student[];
  onRefresh: () => void;
}

export default function AdminStudentsTab({ students, onRefresh }: AdminStudentsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  
  // Modal state to inspect individual profile details
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const handleToggleActive = async (id: number) => {
    try {
      await api.post(`/admin/students/${id}/toggle-active`);
      alert('Student account status toggled successfully.');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update student state.');
    }
  };

  const handleInspectStudent = async (std: Student) => {
    try {
      const details = await api.get<any>(`/admin/students/${std.student_id}`);
      setSelectedStudent(details);
    } catch (err: any) {
      alert(err.message || 'Could not retrieve student details.');
    }
  };

  const filteredStudents = students.filter(std => {
    const matchSearch = std.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        std.register_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept ? String(std.department_id) === selectedDept : true;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Profiles</h1>
        <p className="text-slate-500 mt-1">Review register codes, CGPA metrics, academic credentials, and toggle account states.</p>
      </div>

      {/* Filters Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></span>
          <input
            type="text"
            placeholder="Search students by name or register number..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm focus:border-accent outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-xs outline-none cursor-pointer"
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
          >
            <option value="">All Branches</option>
            <option value="1">CSE</option>
            <option value="2">CSE-AI</option>
            <option value="3">ECE</option>
            <option value="4">EEE</option>
            <option value="5">Mechanical</option>
            <option value="6">Civil</option>
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Register Code & Name</th>
                <th className="p-4">Branch</th>
                <th className="p-4 text-center">CGPA</th>
                <th className="p-4 text-center">Completion</th>
                <th className="p-4 text-center">Account State</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white/40">
              {filteredStudents.map((std) => (
                <tr key={std.student_id} className="hover:bg-white/50 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-slate-800 block">{std.user.full_name}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{std.register_number} • {std.user.email}</span>
                  </td>
                  <td className="p-4 font-semibold">{std.department.department_code}</td>
                  <td className="p-4 text-center font-bold text-slate-800">{std.cgpa}</td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-bold">
                      {std.profile_completion_percentage}%
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleToggleActive(std.student_id)}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer hover:scale-102 transition-transform ${
                        std.user.is_active 
                          ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                          : 'bg-rose-50 text-rose-500 border-rose-100'
                      }`}
                    >
                      {std.user.is_active ? 'Active' : 'Deactivated'}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleInspectStudent(std)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 rounded-lg hover:shadow-xs transition-all flex items-center gap-0.5 mx-auto"
                    >
                      Inspect Profile
                      <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">No students registered in database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl max-h-[85vh] overflow-y-auto space-y-6">
            <button 
              onClick={() => setSelectedStudent(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl"
            >
              <X size={20} />
            </button>

            {/* Header info */}
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-xl font-bold text-slate-800">{selectedStudent.user.full_name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Register Number: {selectedStudent.register_number} • Dept: {selectedStudent.department.department_code}
              </p>
              <p className="text-xs text-slate-400">CGPA: {selectedStudent.cgpa} • Semester: {selectedStudent.current_semester} • Grad Year: {selectedStudent.graduation_year}</p>
            </div>

            {/* Bio and metadata */}
            {selectedStudent.bio && (
              <div className="space-y-1.5">
                <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wide">Candidate Bio</span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">{selectedStudent.bio}</p>
              </div>
            )}

            {/* Skills */}
            <div className="space-y-3">
              <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wide">Skills Taxonomy</span>
              {selectedStudent.skills?.length === 0 ? (
                <p className="text-xs text-slate-400">No skills added by student.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.skills?.map((s: any, idx: number) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200/50 font-medium">
                      {s.skill.skill_name} ({s.proficiency_level})
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Education details */}
            <div className="space-y-3">
              <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wide font-mono">Academic Records</span>
              {selectedStudent.education?.length === 0 ? (
                <p className="text-xs text-slate-400">No educational credentials tracked.</p>
              ) : (
                <div className="space-y-2">
                  {selectedStudent.education?.map((edu: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-2xl border border-slate-150 bg-slate-50/50 flex justify-between items-center text-xs">
                      <div>
                        <strong className="font-bold text-slate-800 block">{edu.institution_name}</strong>
                        <span className="text-[10px] text-slate-400">{edu.qualification} in {edu.specialization} • {edu.start_year} - {edu.end_year}</span>
                      </div>
                      <span className="font-bold text-slate-800">{edu.score} {edu.score_type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
