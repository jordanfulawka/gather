import dbConnect from '@/lib/mongoose';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { Room } from '@/models/Room';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  await dbConnect();
  const { id } = await params;

  const room = await Room.findById(id);
  return new Response(JSON.stringify(room), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
