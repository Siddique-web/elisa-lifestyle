import { io } from 'socket.io-client';
import { API_URL } from './api';

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(API_URL || undefined, {
      path: '/socket.io',
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnection: false,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
