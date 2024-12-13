import { io } from 'socket.io-client';

const SOCKET_URL = 'https://draw-board-server.vercel.app/';
const socket = io(SOCKET_URL);

export default socket;