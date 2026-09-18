import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      timeout: 5000,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id);
      if (userId) {
        socket.emit('join_user_room', userId);
      }
    });

    socket.on('connect_error', (err) => {
      // Gracefully log without crashing
      // console.debug('Socket server offline or unreachable');
    });

    socket.on('disconnect', () => {
      // console.debug('Socket disconnected');
    });
  } else if (userId && socket.connected) {
    socket.emit('join_user_room', userId);
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
