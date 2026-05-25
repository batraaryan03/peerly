import { PeerServer } from 'peer';

const PORT = parseInt(process.env.SIGNALING_PORT || '3001', 10);

const server = PeerServer({
  port: PORT,
  path: '/peerjs',
  allow_discovery: true,   // let clients discover each other
  proxied: false,
  corsOptions: { origin: true },
});

server.on('connection', (client) => {
  console.log(`[PeerJS] Client connected: ${client.getId()}`);
});

server.on('disconnect', (client) => {
  console.log(`[PeerJS] Client disconnected: ${client.getId()}`);
});

server.on('error', (err) => {
  console.error('[PeerJS] Error:', err);
});

console.log(`[PeerJS] Signaling server running on port ${PORT} (path: /peerjs)`);
