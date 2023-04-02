import { Server } from 'socket.io';
import SocketIOClient from 'socket.io-client';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket proxy is already running');
  } else {
    console.log('Socket proxy is initializing');
    const io = new Server(res.socket.server, {
      path: '/api/socketio'
    });
    res.socket.server.io = io;

    io.on('connection', socket => {
      const target = SocketIOClient.connect(`ws://127.0.0.1:${process.env.WS_PORT}`);

      socket.on('disconnect', () => {
        target.disconnect();
      });

      target.on('disconnect', () => {
        socket.disconnect();
      });

      socket.onAny((event, ...args) => {
        target.emit(event, ...args);
      });

      target.onAny((event, ...args) => {
        socket.emit(event, ...args);
      });
    });
  }
  res.end();
};

export default handler;