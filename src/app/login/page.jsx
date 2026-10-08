'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore.js';

export default function AdminLogin() {
  const router = useRouter();
  const { login, isLoading, error } = useAdminAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);   // throws if not ADMIN
      router.replace('/');
    } catch (err) {
      // error is already in the store
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-slate-600" />
          </div>
          <h1 className="text-xl font-black text-slate-800">Admin Login</h1>
          <p className="text-sm text-slate-500 mt-1">Maza Printwala control panel</p>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-500" />
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-700 disabled:opacity-70">
          {isLoading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
