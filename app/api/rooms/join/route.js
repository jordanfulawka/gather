import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { Room } from '@/models/Room';
import dbConnect from '@/lib/mongoose';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  await dbConnect();
  const { inviteCode } = await request.json();
  const room = await Room.findOneAndUpdate(
    { inviteCode },
    { $addToSet: { members: session.user.id } },
    { new: true },
  );
  if (!room) {
    return new Response('No room found', {
      status: 404,
    });
  }

  return new Response(JSON.stringify(room), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
