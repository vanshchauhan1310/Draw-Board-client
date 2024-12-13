import { io } from 'socket.io-client';

const socket = io("https://draw-board-server.vercel.app", {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

export default socket;
