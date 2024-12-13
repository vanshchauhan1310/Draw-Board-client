import { io } from 'socket.io-client';

const socket = io("https://draw-board-server.onrender.com/", {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

export default socket;
