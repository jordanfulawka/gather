import dbConnect from '@/lib/mongoose';
import { User } from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { email, username, password } = body;

  if (!username || !email || !password) {
    return new Response(
      JSON.stringify({
        status: 'fail',
        message: 'not all fields are filled',
      }),
      {
        status: 400,
      },
    );
  }

  const user = await User.exists({
    $or: [{ username: username }, { email: email }],
  });

  if (user) {
    return new Response(
      JSON.stringify({
        status: 'fail',
        message: 'user already exists',
      }),
      {
        status: 409,
      },
    );
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      passwordHash,
    });

    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'user created successfully',
      }),
      {
        status: 201,
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: 'fail',
        message: 'an unknown error occured',
      }),
      {
        status: 500,
      },
    );
  }
}
