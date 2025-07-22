import { Server, WebSocket } from 'ws';
import logging from '../../utils/logging';
import http from 'http';

interface DeviceRegisterInput {
  action?: string;
  deviceId?: string;
}

interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
}

export default class BroadcastService {
  private static instance: BroadcastService;
  private wss?: Server;
  public static devices: Map<string, WebSocket> = new Map();
  private heartbeatInterval?: NodeJS.Timeout;

  public setupWebSocketEvents(server: http.Server) {
    this.wss = new WebSocket.Server({ server });
    this.setWebSocketServerEvents(server);
    this.setWebSocketConnectionEvents();
    this.setupHeartbeat();
  }

  public static getInstance(): BroadcastService {
    if (!BroadcastService.instance) {
      BroadcastService.instance = new BroadcastService();
    }

    return BroadcastService.instance;
  }

  private setWebSocketServerEvents(server: http.Server) {
    this.wss!.on('listening', () => {
      const address = server.address();
      const port = typeof address === 'string' ? address : address?.port;
      logging.info(`WebSocket server is now listening on port: ${port}`);
    });

    this.wss!.on('error', (error) => {
      logging.error('WebSocket server error:', error);
    });
  }

  private setWebSocketConnectionEvents() {
    this.wss!.on('connection', (ws: ExtendedWebSocket) => {
      logging.info('New client connection established');

      ws.isAlive = true;

      ws.on('pong', (event) => {
        logging.info('Pong Recieved from client:', event);
        ws.isAlive = true;
      });

      ws.on('open', () => logging.info('Connection opened'));
      ws.on('message', (message: string) =>
        this.handleClientMessage(ws, message),
      );
      ws.on('close', (code, reason) => {
        logging.info('Client connection closed', { code, reason });
        clearInterval(this.heartbeatInterval);
      });
      ws.on('error', (error) => logging.error('WebSocket error:', error));
    });
  }

  private handleClientMessage(ws: WebSocket, message: string) {
    logging.info(`Message received from client: ${message.toString()}`);

    try {
      const deviceRegister = JSON.parse(message) as DeviceRegisterInput;
      if (deviceRegister.action === 'ping') {
        logging.info('Received ping, sending pong...');
        ws.send(JSON.stringify({ action: 'pong' }));
      } else if (!deviceRegister?.deviceId) {
        logging.error('Invalid device registration data');
        return;
      } else {
        BroadcastService.devices.set(deviceRegister.deviceId, ws);
        logging.info(`Device registered: ${message.toString()}`);
      }
    } catch (error) {
      logging.error('Failed to parse message error:', error);
    }
  }

  private setupHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (!this.wss) return;
      logging.info('fire heartbeat interval');
      this.wss.clients.forEach((ws: ExtendedWebSocket) => {
        if (!ws.isAlive) {
          ws.terminate();
          return;
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, Number(process.env.HEARTBEAT_INTERVAL) || 30000);
  }
}
