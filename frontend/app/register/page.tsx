'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Briefcase, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { api } from '../../lib/api';

const registerSchema = zod.object({
  fullName: zod.string().min(2, 'Name must be at least 2 characters'),
  registerNumber: zod.string().min(3, 'Register number must be at least 3 characters'),
  departmentId: zod.string().min(1, 'Please select your department'),
  graduationYear: zod.coerce.number().min(2020, 'Year must be after 2020').max(2100, 'Year must be before 2100'),
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: zod.string().min(6, 'Confirm password is required')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterInputs = zod.infer<typeof registerSchema>;

interface DepartmentObj {
  department_id: number;
  department_name: string;
  department_code: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<DepartmentObj[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema)
  });

  // Load departments from DB on load
  useEffect(() => {
    async function loadDepts() {
      try {
        const data = await api.get<DepartmentObj[]>('/students/departments');
        setDepartments(data);
      } catch (err) {
        // Fallback static list in case of network issues during static page generation
        setDepartments([
          { department_id: 1, department_name: 'Computer Science and Engineering', department_code: 'CSE' },
          { department_id: 2, department_name: 'Computer Science - Artificial Intelligence', department_code: 'CSE-AI' },
          { department_id: 3, department_name: 'Electronics and Communication Engineering', department_code: 'ECE' },
          { department_id: 4, department_name: 'Electrical and Electronics Engineering', department_code: 'EEE' },
          { department_id: 5, department_name: 'Mechanical Engineering', department_code: 'Mechanical' },
          { department_id: 6, department_name: 'Civil Engineering', department_code: 'Civil' }
        ]);
      }
    }
    loadDepts();
  }, []);

  const onSubmit = async (data: RegisterInputs) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const payload = {
        full_name: data.fullName,
        email: data.email,
        password: data.password,
        role: 'student',
        register_number: data.registerNumber,
        department_id: Number(data.departmentId),
        graduation_year: data.graduationYear
      };

      await api.post('/auth/register', payload);
      setSuccessMsg('Registration completed successfully! Redirecting to login page...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Check if email or register number already exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4">
      {/* Glow Backdrops */}
      <div className="absolute top-[5%] left-[5%] w-[400px] h-[400px] rounded-full bg-[#fbcfe8] opacity-30 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[5%] w-[450px] h-[450px] rounded-full bg-[#d8b4fe] opacity-35 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-lg z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white shadow-md">
              <Briefcase size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">InternTrack</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Create your account</h2>
          <p className="text-sm text-slate-500 mt-1">Get started with automated progress tracking</p>
        </div>

        {/* Card Form */}
        <div className="glass-panel p-8 rounded-[2rem] shadow-xl">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-start gap-2.5">
              <CheckCircle size={18} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Aarav Patel"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-accent outline-none text-sm transition-all"
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Register Number
                </label>
                <input
                  type="text"
                  placeholder="SRN2023CSE01"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-accent outline-none text-sm transition-all"
                  {...register('registerNumber')}
                />
                {errors.registerNumber && (
                  <p className="text-xs text-rose-500 mt-1">{errors.registerNumber.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Department
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-accent outline-none text-sm transition-all appearance-none cursor-pointer"
                  {...register('departmentId')}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.department_id} value={String(dept.department_id)}>
                      {dept.department_code} - {dept.department_name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-xs text-rose-500 mt-1">{errors.departmentId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Graduation Year
                </label>
                <input
                  type="number"
                  placeholder="2027"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-accent outline-none text-sm transition-all"
                  {...register('graduationYear')}
                />
                {errors.graduationYear && (
                  <p className="text-xs text-rose-500 mt-1">{errors.graduationYear.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="aarav.patel@student.edu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-accent outline-none text-sm transition-all"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-accent outline-none text-sm transition-all"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-accent outline-none text-sm transition-all"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-accent hover:bg-rose-600 disabled:bg-rose-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg shadow-rose-100 hover:scale-101 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-accent font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
