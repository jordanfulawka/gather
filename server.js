import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import { Message } from './models/Message.js';
import dbConnect from './lib/mongoose.js';

const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async () => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  await dbConnect();
  io.on('connection', (socket) => {
    // ...
    console.log(`${socket.id} has joined the server`);

    socket.on('send_message', async (data) => {
      console.log('send_message', data);
      const message = await Message.create(data);
      io.to(data.roomId).emit('receive_message', message);
    });

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
    });

    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`Ready on http://${hostname}:${port}`);
    });
});
