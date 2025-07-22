import { Server, WebSocket } from 'ws';
import logging from '../../utils/logging';
import http from "http";

interface DeviceRegisterInput {
    action?: string;
    deviceId?: string;
}

export default class BroadcastService {
    private static instance: BroadcastService;
    private wss?: Server;
    public static devices: Map<string, WebSocket> = new Map();

    public setupWebSocketEvents(server: http.Server) {
        this.wss = new WebSocket.Server({ server });
        this.setWebSocketServerEvents(server);
        this.setWebSocketConnectionEvents();
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
        this.wss!.on('connection', (ws: WebSocket) => {
            logging.info('New client connection established');

            ws.on('open', () => logging.info('Connection opened'));
            ws.on('message', (message: string) => this.handleClientMessage(ws, message));
            ws.on('close', (code, reason) => logging.info('Client connection closed', {code, reason}));
            ws.on('error', (error) => logging.error('WebSocket error:', error));
        });
    }

    private handleClientMessage(ws: WebSocket, message: string) {
        logging.info('Message received from client:', message);
        try {
            ws.addEventListener('message', messageEvent => {
                let deviceRegister;
                if (typeof messageEvent.data === "string") {
                    deviceRegister = JSON.parse(messageEvent.data) as DeviceRegisterInput;
                }
                BroadcastService.devices.set(deviceRegister?.deviceId as string, messageEvent.target);
            });
            logging.info(`Device registered: ${message}`);
        } catch (error) {
            logging.error('Failed to parse message:', message);
        }
    }
}
