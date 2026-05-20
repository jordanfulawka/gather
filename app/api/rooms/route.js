import dbConnect from '@/lib/mongoose';
import { Room } from '@/models/Room';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  await dbConnect();
  const rooms = await Room.find({ members: session.user.id });
  return new Response(JSON.stringify(rooms), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { name, description } = body;

  const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  await dbConnect();
  const newRoom = {
    name,
    description,
    inviteCode,
    createdBy: session.user.id,
    members: [session.user.id],
  };

  const room = await Room.create(newRoom);

  return new Response(JSON.stringify(room), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
