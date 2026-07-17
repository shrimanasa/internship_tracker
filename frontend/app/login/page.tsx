'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Briefcase, Eye, EyeOff, AlertCircle, Info, Lock } from 'lucide-react';
import { api, setAuthSession } from '../../lib/api';

const loginSchema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(1, 'Password is required')
});

type LoginInputs = zod.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInputs) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // API expects form-data for OAuth2PasswordRequestForm
      const formData = new FormData();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const res = await api.post<any>('/auth/login', formData);
      
      // Save session info
      setAuthSession(res.access_token, res.role, res.full_name, res.user_id);
      
      // Redirect based on role
      if (res.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/student');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-[#fbcfe8] opacity-35 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#d8b4fe] opacity-35 blur-[110px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white shadow-md">
              <Briefcase size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">InternTrack</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome back</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to manage your placement pipeline</p>
        </div>

        {/* Card Form */}
        <div className="glass-panel p-8 rounded-3xl shadow-xl">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-start gap-2.5 animate-shake">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@student.edu"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-rose-500/10 outline-none text-sm transition-all"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-rose-500/10 outline-none text-sm transition-all"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm py-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-accent border-slate-300 focus:ring-accent"
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-accent hover:bg-rose-600 disabled:bg-rose-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg shadow-rose-100 hover:scale-101 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-accent font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Hint Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 shadow-sm flex gap-3">
          <Info size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-white uppercase block mb-1">Demo Credentials Hint</span>
            <div className="flex flex-col gap-1 text-slate-400">
              <div><strong className="text-slate-300">Admin Portal:</strong> <code className="text-amber-300 font-mono">admin@interntrack.com</code> / <code className="text-amber-300 font-mono">Admin@123</code></div>
              <div><strong className="text-slate-300">Student Profile:</strong> <code className="text-amber-300 font-mono">shrimanasa151106@gmail.com</code> / <code className="text-amber-300 font-mono">Student@123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
