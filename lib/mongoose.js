import mongoose from 'mongoose';
import dns from 'node:dns/promises';

dns.setServers(['1.1.1.1']);

const MONGODB_URI = process.env.MONGODB_URI;
export default dbConnect;

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI env variable');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: 'gather',
  });
  return mongoose;
}
