import { WebSocket } from 'ws';
import logging from '../../utils/logging';
import BroadcastService from './index';

// interface BroadcastServiceRegisterInput {
//     data?: {
//         type?: string;
//         lift_name?: string;
//         floor_name?: string;
//         device_id?: string;
//     };
// }

export default class BroadcastModule {
  public broadcastToSpecificDevice(data: any) {
    if (!data?.data?.device_id) {
      logging.info('Cannot send message: Invalid data or deviceId missing');
      return;
    }
    const deviceId = data.data.device_id;
    const client = BroadcastService.devices.get(deviceId);
    if (!client) {
      logging.info(
        `Cannot send message: No WebSocket found for device id: ${deviceId}`,
      );
      return;
    }

    if (client.readyState !== WebSocket.OPEN) {
      logging.info(
        `Cannot send message: WebSocket not open for device id: ${deviceId}`,
      );
      return;
    }

    client.send(JSON.stringify(data), (err) => {
      if (err) {
        logging.error('Failed to send message:', err);
      } else {
        logging.info(`Message sent successfully to device id: ${deviceId}`);
      }
    });
  }

  public broadcastToAllDevice(data: any) {
    const clients = Array.from(BroadcastService.devices.values());
    clients.forEach((client) => {
      client.send(JSON.stringify(data), (err) => {
        if (err) {
          logging.error('Failed to send message:', err);
        } else {
          logging.info(`Message sent successfully`);
        }
      });
    });
  }
}
