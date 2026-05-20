'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    async function getRooms() {
      const response = await fetch(`/api/rooms`);
      const data = await response.json();
      setRooms(data);
      console.log(data);
    }
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
          {rooms?.map((room) => (
            <li key={room._id}>
              <Link
                href={`/rooms/${room._id}`}
                className='block px-3 py-2 rounded-md text-[#F8FAFC] hover:bg-[#7C3AED] transition-colors'
              >
                {room.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className='px-3 py-4 border-t border-[#2D2D44] space-y-2'>
        <button
          className='w-full px-3 py-2 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-[#F8FAFC] text-sm
  font-medium transition-colors'
        >
          Create Room
        </button>
        <button
          className='w-full px-3 py-2 rounded-md border border-[#2D2D44] text-[#94A3B8] hover:text-[#F8FAFC]
  text-sm transition-colors'
        >
          Join Room
        </button>
      </div>
    </aside>
  );
}
