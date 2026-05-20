'use client';

import { useEffect, useState } from 'react';

export default function CreateRoomModal({ onClose, onRoomCreated }) {
  const [inviteCode, setInviteCode] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch(`/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    const data = await response.json();
    setInviteCode(data.inviteCode);
    setRoomCreated(true);
    onRoomCreated();
  }

  return (
    <div
      className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'
      onClick={onClose}
    >
      <div
        className='bg-[#1A1A2E] border border-[#2D2D44] rounded-lg p-6 w-96'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-[#F8FAFC] text-lg font-semibold mb-4'>
          Create New Room
        </h2>

        <form className='space-y-3' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Room name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='w-full px-3 py-2 bg-[#0F0F1A] border border-[#2D2D44] rounded-md text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED]'
          />
          <input
            type='text'
            placeholder='Description (optional)'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full px-3 py-2 bg-[#0F0F1A] border border-[#2D2D44] rounded-md text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED]'
          />
          <div className='flex gap-2 justify-end pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border border-[#2D2D44] text-[#94A3B8] hover:text-[#F8FAFC] rounded-md text-sm transition-colors'
            >
              {roomCreated ? 'Done' : 'Cancel'}
            </button>
            {!roomCreated && (
              <button
                type='submit'
                className='px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-[#F8FAFC] rounded-md text-sm font-medium transition-colors'
              >
                Create
              </button>
            )}
          </div>
        </form>

        {inviteCode && (
          <div className='mt-4 p-3 bg-[#0F0F1A] border border-[#2D2D44] rounded-md'>
            <p className='text-[#94A3B8] text-xs mb-1'>
              Share this invite code:
            </p>
            <p className='text-[#A78BFA] font-mono font-bold tracking-widest'>
              {inviteCode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
