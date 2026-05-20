'use client';

import { useSocket } from '@/context/SocketContext';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RoomPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const params = useParams();
  const session = useSession();

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
    socket?.on('receive_message', (data) => {
      console.log('received');
      setMessages((messages) => [...messages, data]);
    });
  }, [socket]);

  useEffect(() => {
    socket?.emit('join-room', params.id);
  }, [socket]);

  useEffect(() => {
    async function getRoomAndMessages() {
      const [roomResult, messagesResult] = await Promise.all([
        fetch(`/api/rooms/${params.id}`),
        fetch(`/api/rooms/${params.id}/messages`),
      ]);

      const [roomData, messagesData] = await Promise.all([
        roomResult.json(),
        messagesResult.json(),
      ]);

      setRoom(roomData);
      setMessages(messagesData);
    }
    getRoomAndMessages();
  }, []);

  return (
    <div>
      <h1>Room Name: {room?.name}</h1>

      <div>
        {messages.map((message) => (
          <div key={message._id}>
            <span>{message.senderName}: </span>
            <span>{message.content}</span>
          </div>
        ))}
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
