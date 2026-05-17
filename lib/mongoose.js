import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export default dbConnect;

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI env variable');
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
  return mongoose;
}
