import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import { Message } from '@/models/Message';
import { getServerSession } from 'next-auth';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthenticated', {
      status: 401,
    });
  }

  await dbConnect();
  const { id } = await params;

  const messages = await Message.find({ roomId: id })
    .sort({ createdAt: 1 })
    .limit(50);

  return new Response(JSON.stringify(messages), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
