'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, Users, Building, Briefcase, Layers, 
  FileSpreadsheet, History, LogOut, Bell, BellOff, Check,
  Menu, X
} from 'lucide-react';

import { api, getAuthToken, clearAuthSession, getUserRole, getUserName } from '../../lib/api';
import AdminDashboardTab from '../../components/AdminDashboardTab';
import AdminStudentsTab from '../../components/AdminStudentsTab';
import AdminCompaniesTab from '../../components/AdminCompaniesTab';
import AdminInternshipsTab from '../../components/AdminInternshipsTab';
import AdminApplicationsTab from '../../components/AdminApplicationsTab';
import AdminReportsTab from '../../components/AdminReportsTab';
import AdminAuditLogsTab from '../../components/AdminAuditLogsTab';

export default function AdminPortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminName, setAdminName] = useState('Admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Loaded data pools
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [masterSkills, setMasterSkills] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Authentication check
  useEffect(() => {
    const token = getAuthToken();
    const role = getUserRole();
    if (!token || role !== 'admin') {
      router.push('/login');
      return;
    }
    setAdminName(getUserName() || 'Admin');
  }, [router]);

  // Load and refresh tab specific data
  useEffect(() => {
    if (!getAuthToken()) return;
    refreshData();
  }, [activeTab]);

  const refreshData = async () => {
    try {
      // Reload notifications
      const notifs = await api.get<any[]>('/notifications?unread_only=true');
      setNotifications(notifs);

      if (activeTab === 'dashboard') {
        const dData = await api.get<any>('/admin/dashboard');
        setDashboardData(dData);
      } else if (activeTab === 'students') {
        const stds = await api.get<any[]>('/admin/students');
        setStudents(stds);
      } else if (activeTab === 'companies') {
        const comps = await api.get<any[]>('/companies');
        setCompanies(comps);
      } else if (activeTab === 'internships') {
        const ints = await api.get<any[]>('/internships');
        setInternships(ints);
        const comps = await api.get<any[]>('/companies');
        setCompanies(comps);
        const skills = await api.get<any[]>('/students/skills/master');
        setMasterSkills(skills);
      } else if (activeTab === 'applications') {
        const apps = await api.get<any[]>('/admin/applications');
        setApplications(apps);
      } else if (activeTab === 'audit') {
        const logs = await api.get<any[]>('/admin/audit-logs');
        setAuditLogs(logs);
      }
    } catch (e) {
      console.error('Failed to load admin data:', e);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    router.push('/login');
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await api.post('/notifications/read');
      setNotifications([]);
      setShowNotifications(false);
    } catch (e) {
      console.error(e);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Student Profiles', icon: Users },
    { id: 'companies', label: 'Company Manager', icon: Building },
    { id: 'internships', label: 'Internship Postings', icon: Briefcase },
    { id: 'applications', label: 'Candidate Tracks', icon: Layers },
    { id: 'reports', label: 'Placement Reports', icon: FileSpreadsheet },
    { id: 'audit', label: 'Audit Logs Viewer', icon: History }
  ];

  const unreadNotifsCount = notifications.length;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Sidebar - Deep Slate Navy styling */}
      <aside className="hidden md:flex flex-col w-64 glass-sidebar min-h-screen p-5 text-rose-900 shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white shadow-md">
            <Briefcase size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight text-rose-900">InternTrack</span>
        </div>

        <nav className="space-y-1.5 flex-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-accent text-white shadow-md shadow-pink-900/10' 
                    : 'text-rose-900/60 hover:text-rose-500 hover:bg-pink-100/40'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="pt-5 border-t border-pink-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-900/60 hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <header className="md:hidden sticky top-0 z-50 bg-[#0f172a] text-white px-5 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Menu size={22} className="cursor-pointer" onClick={() => setMobileMenuOpen(true)} />
          <span className="text-base font-bold">InternTrack</span>
        </div>
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-1">
            <Bell size={20} />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex md:hidden">
          <div className="w-64 bg-[#0f172a] p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-white">Menu</span>
                <X size={22} className="text-slate-400 cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
              </div>
              <nav className="space-y-1">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                        isActive ? 'bg-accent text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-rose-400"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="hidden md:flex sticky top-0 z-40 glass-nav px-8 py-4 items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Administration Console</span>
            <span>/</span>
            <span className="text-slate-800">{activeTab}</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-semibold text-slate-600 bg-white/50 border border-slate-200/40 px-3 py-1.5 rounded-xl">
              Verification Officer: <strong className="font-bold text-slate-800">{adminName}</strong>
            </span>

            {/* Notification drop */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-white/50 border border-slate-200/40 hover:bg-white text-slate-600 transition-all hover:shadow-xs"
              >
                <Bell size={18} />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-[#f8fafc]"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Notifications</span>
                    {unreadNotifsCount > 0 && (
                      <button 
                        onClick={handleMarkAllNotificationsRead}
                        className="text-[10px] font-bold text-accent hover:underline flex items-center gap-0.5"
                      >
                        <Check size={12} />
                        Mark read
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs flex flex-col gap-1 items-center">
                        <BellOff size={20} className="text-slate-300" />
                        <span>No new notifications</span>
                      </div>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                          <span className="font-bold text-slate-800 text-[11px] block">{notif.title}</span>
                          <span className="text-[10px] text-slate-500 leading-normal block">{notif.message}</span>
                          <span className="text-[8px] text-slate-400 block">
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto z-10 max-w-6xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab data={dashboardData} onNavigate={setActiveTab} />
          )}
          {activeTab === 'students' && (
            <AdminStudentsTab students={students} onRefresh={refreshData} />
          )}
          {activeTab === 'companies' && (
            <AdminCompaniesTab companies={companies} onRefresh={refreshData} />
          )}
          {activeTab === 'internships' && (
            <AdminInternshipsTab 
              internships={internships} 
              companies={companies} 
              masterSkills={masterSkills} 
              onRefresh={refreshData} 
            />
          )}
          {activeTab === 'applications' && (
            <AdminApplicationsTab applications={applications} onRefresh={refreshData} />
          )}
          {activeTab === 'reports' && (
            <AdminReportsTab />
          )}
          {activeTab === 'audit' && (
            <AdminAuditLogsTab logs={auditLogs} />
          )}
        </main>
      </div>
    </div>
  );
}
