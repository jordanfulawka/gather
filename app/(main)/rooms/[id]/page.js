'use client';

import { useSocket } from '@/context/SocketContext';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function RoomPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const session = useSession();
  const ref = useRef();

  const socket = useSocket();

  function handleSubmit(e) {
    console.log(session);
    e.preventDefault();
    const newMessage = {
      roomId: params.id,
      senderId: session.data.user.id,
      senderName: session.data.user.username,
      content: input,
    };
    socket.emit('send_message', newMessage);
    setInput('');
  }

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-room', params.id);
    socket.on('receive_message', (data) => {
      setMessages((messages) => [...messages, data]);
    });

    socket.on('reconnect', () => {
      socket.emit('join-room', params.id);
    });

    return () => {
      socket.off('receive_message');
      socket.off('reconnect');
      socket.emit('leave-room', params.id);
    };
  }, [socket, params.id]);

  useEffect(() => {
    async function getRoomAndMessages() {
      try {
        const [roomResult, messagesResult] = await Promise.all([
          fetch(`/api/rooms/${params.id}`),
          fetch(`/api/rooms/${params.id}/messages`),
        ]);

        if (!roomResult.ok || !messagesResult.ok) {
          throw new Error();
        }

        const [roomData, messagesData] = await Promise.all([
          roomResult.json(),
          messagesResult.json(),
        ]);

        setRoom(roomData);
        setMessages(messagesData);
      } catch (error) {
        setError('Could not load room!');
      } finally {
        setLoading(false);
      }
    }
    getRoomAndMessages();
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className='flex flex-col h-full bg-[#0F0F1A]'>
      <div className='flex justify-between items-center px-6 py-4 bg-[#1A1A2E] border-b border-[#2D2D44] shrink-0'>
        <h1 className='text-[#F8FAFC] font-semibold text-lg'>{room?.name}</h1>
        <div className='flex items-center gap-2'>
          <span className='text-[#94A3B8] text-xs'>Invite Code:</span>
          <span className='text-[#A78BFA] font-mono text-sm font-semibold tracking-widest'>
            {room?.inviteCode}
          </span>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-4 space-y-3'>
        {loading && (
          <p className='text-[#94A3B8] text-sm'>Loading messages...</p>
        )}
        {error && <p className=' text-[#EF4444] text-sm'>{error}</p>}
        {!loading &&
          !error &&
          messages.map((message) => (
            <div key={message._id} className='flex flex-col'>
              <div className='flex items-baseline gap-2'>
                <span className='text-[#A78BFA] text-sm font-semibold'>
                  {message.senderName}
                </span>
                <span className='text-[#94A3B8] text-xs'>
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className='text-[#F8FAFC] text-sm'>{message.content}</p>
            </div>
          ))}
        <div ref={ref} />
      </div>

      <div className='px-6 py-4 bg-[#1A1A2E] border-t border-[#2D2D44] shrink-0'>
        <form onSubmit={handleSubmit} className='flex gap-3'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type a message...'
            required
            className='flex-1 px-4 py-2 bg-[#0F0F1A] border border-[#2D2D44] rounded-md text-[#F8FAFC]
  placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED] text-sm'
          />
          <button
            type='submit'
            className='px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-[#F8FAFC] rounded-md text-sm
  font-medium transition-colors'
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
