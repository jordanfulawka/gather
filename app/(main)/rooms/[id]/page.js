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

    socket?.on('receive_message', (data) => {
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket]);

  useEffect(() => {
    socket?.emit('join-room', params.id);
  }, [socket]);

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
    <div className='flex flex-col h-full'>
      <div className='flex justify-between'>
        <h1>Room Name: {room?.name}</h1>
        <h1>Invite Code: {room?.inviteCode}</h1>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {loading && (
          <p className='text-[#94A3B8] text-sm'>Loading messages...</p>
        )}
        {error && <p className='text-red-400 text-sm'>{error}</p>}
        {!loading &&
          !error &&
          messages.map((message) => (
            <div key={message._id} className='flex justify-between'>
              <div>
                <span>{message.senderName}: </span>
                <span>{message.content}</span>
              </div>
              <div>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        <div ref={ref} />
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type a message...'
          required
        />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
}
