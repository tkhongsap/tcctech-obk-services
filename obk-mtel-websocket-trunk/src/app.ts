import { createServer } from './utils/server';
import BroadcastService from './services/broadcast_service';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.SERVER_PORT ?? 8080;
async function startServer() {
  try {
    const { server } = await createServer();
    startListening(server);
    setupWebSocket(server);
  } catch (error) {
    console.error('Failed to start server:', error);
    console.log('trigger deploy');
  }
}

function startListening(server: http.Server) {
  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
}

function setupWebSocket(server: http.Server) {
  const broadcastService = new BroadcastService();
  broadcastService.setupWebSocketEvents(server);
}

startServer();
