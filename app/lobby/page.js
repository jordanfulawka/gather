'use client';

import { useEffect, useState } from 'react';

export default function LobbyPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    async function getRooms() {
      const rooms = await fetch('/api/rooms');
      const data = await rooms.json();
      setRooms(data);
    }
    getRooms();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    setLoading(false);
    if (response.ok) {
      const newRoom = await response.json();
      setRooms((rooms) => [...rooms, newRoom]);
    }
  }

  return (
    <div>
      <h1>Lobby</h1>

      <div>
        <h2>Create a Room</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name'>Room Name</label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>Description</label>
            <input
              type='text'
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type='submit' disabled={loading}>
            Create
          </button>
        </form>
      </div>

      <div>
        <h2>Your Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room._id}>{room.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
