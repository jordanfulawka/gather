'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import JoinRoomModal from './JoinRoomModal';
import CreateRoomModal from './CreateRoomModal';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [rooms, setRooms] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getRooms() {
    try {
      setLoading(true);
      const response = await fetch(`/api/rooms`);
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      setError('Could not load rooms!');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <aside className='flex flex-col w-64 h-screen bg-[#1A1A2E] border-r border-[#2D2D44] shrink-0'>
      <div className='px-5 py-4 border-b border-[#2D2D44]'>
        <h1 className='text-xl font-bold text-[#F8FAFC]'>Gather</h1>
      </div>

      <nav className='flex-1 overflow-y-auto px-3 py-4'>
        <p className='text-xs uppercase tracking-widest text-[#94A3B8] mb-3 px-2'>
          Your Rooms
        </p>
        <ul className='space-y-1'>
          {loading && <p className='text-[#94A3B8] text-sm px-2'>Loading...</p>}
          {error && <p className='text-red-400 text-sm px-2'>{error}</p>}
          {!loading &&
            !error &&
            rooms?.map((room) => {
              const isActive = pathname === `/rooms/${room._id}`;
              return (
                <li key={room._id}>
                  <Link
                    href={`/rooms/${room._id}`}
                    className={`block px-3 py-2 rounded-md text-[#F8FAFC] transition-colors ${isActive ? 'bg-[#7C3AED]' : 'hover:bg-[#7C3AED]'}`}
                  >
                    {room.name}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>
      {showJoinModal && (
        <JoinRoomModal
          onRoomJoined={getRooms}
          onClose={() => setShowJoinModal(false)}
        />
      )}
      {showCreateModal && (
        <CreateRoomModal
          onRoomCreated={getRooms}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      <div className='px-3 py-4 border-t border-[#2D2D44] space-y-2'>
        <button
          onClick={() => setShowCreateModal(true)}
          className='w-full px-3 py-2 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-[#F8FAFC] text-sm
  font-medium transition-colors'
        >
          Create Room
        </button>
        <button
          onClick={() => setShowJoinModal(true)}
          className='w-full px-3 py-2 rounded-md border border-[#2D2D44] text-[#94A3B8] hover:text-[#F8FAFC]
  text-sm transition-colors'
        >
          Join Room
        </button>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className='w-full px-3 py-2 rounded-md border border-[#2D2D44] text-[#94A3B8] hover:text-[#F8FAFC] text-sm
  transition-colors'
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
