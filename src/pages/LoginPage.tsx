import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const result = login(username.trim(), password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full mb-4">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-slate-800 dark:text-white text-2xl font-bold">BYUH Security IT Team</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to access the dashboard</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Enter your username" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" className={inputCls} />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
