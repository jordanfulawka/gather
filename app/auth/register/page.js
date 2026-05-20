'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    setLoading(false);

    if (response.ok) {
      router.push('/auth/login');
    } else {
      const data = await response.json();
      setError(data.error);
    }
  }

  return (
    <div className='min-h-screen bg-[#0F0F1A] flex items-center justify-center'>
      <div className='bg-[#1A1A2E] border border-[#2D2D44] rounded-lg p-8 w-full max-w-sm'>
        <h1 className='text-[#F8FAFC] text-2xl font-bold mb-1'>Gather</h1>
        <p className='text-[#94A3B8] text-sm mb-6'>Create an account</p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1'>
            <label htmlFor='email' className='text-[#94A3B8] text-sm'>Email</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full px-3 py-2 bg-[#0F0F1A] border border-[#2D2D44] rounded-md text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED] text-sm'
            />
          </div>
          <div className='space-y-1'>
            <label htmlFor='username' className='text-[#94A3B8] text-sm'>Username</label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className='w-full px-3 py-2 bg-[#0F0F1A] border border-[#2D2D44] rounded-md text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED] text-sm'
            />
          </div>
          <div className='space-y-1'>
            <label htmlFor='password' className='text-[#94A3B8] text-sm'>Password</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-3 py-2 bg-[#0F0F1A] border border-[#2D2D44] rounded-md text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED] text-sm'
            />
          </div>
          {error && <p className='text-[#EF4444] text-sm'>{error}</p>}
          <button
            type='submit'
            disabled={loading}
            className='w-full px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-[#F8FAFC] rounded-md text-sm font-medium transition-colors disabled:opacity-50'
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className='text-[#94A3B8] text-sm mt-6 text-center'>
          Already have an account?{' '}
          <a href='/auth/login' className='text-[#A78BFA] hover:underline'>Sign in</a>
        </p>
      </div>
    </div>
  );
}
