'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const response = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    setLoading(false);

    if (response.ok) {
      router.push('/rooms');
    } else {
      setError('Invalid email or password');
    }
  }

  return (
    <div className='min-h-screen bg-[#0F0F1A] flex items-center justify-center'>
      <div className='bg-[#1A1A2E] border border-[#2D2D44] rounded-lg p-8 w-full max-w-sm'>
        <h1 className='text-[#F8FAFC] text-2xl font-bold mb-1'>Gather</h1>
        <p className='text-[#94A3B8] text-sm mb-6'>Sign in to your account</p>

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
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className='text-[#94A3B8] text-sm mt-6 text-center'>
          Don't have an account?{' '}
          <a href='/auth/register' className='text-[#A78BFA] hover:underline'>Register</a>
        </p>
      </div>
    </div>
  );
}
