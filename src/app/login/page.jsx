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
    <div className="min-h-screen w-full flex items-center justify-center neu-flat">
      <form onSubmit={onSubmit} className="w-full max-w-sm neu-flat p-8 rounded-2xl    space-y-5">
        <div className="text-center">
          <img src="/logo-maaza.png" alt="Maaza Printwala" className="h-10 w-auto mx-auto mb-4 object-contain" />
          <h1 className="text-xl font-black text-[var(--text-main)]">Admin Login</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Maza Printwala control panel</p>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50  border-red-200 rounded-lg p-3">{error}</div>}

        <div>
          <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 neu-flat   rounded-xl text-sm outline-none focus:border-[var(--text-main)]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 neu-flat   rounded-xl text-sm outline-none focus:border-[var(--text-main)]" />
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full py-2.5 bg-[var(--text-main)] text-[var(--bg-card)] text-[var(--text-main)] rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-70 neu-btn">
          {isLoading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
