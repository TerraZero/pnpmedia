import sio from 'socket.io';
import SocketFactory from './socket';

export default function () {
  this.nuxt.hook('listen', (server) => {
    const socket = sio(server, {
      cors: {
        origin: '*',
      },
    });

    SocketFactory(socket);
  });
}