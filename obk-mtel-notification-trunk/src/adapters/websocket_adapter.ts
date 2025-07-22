import axios from 'axios';
import logging from '../libs/logging';
export default class WebSocketAdapter {
  public async broadcast(body: object): Promise<void> {
    try {
      logging.info('start sending message to web socket');

      const baseUrl = process.env.OB_WEB_SOCKET_URL || '';
      const response = await axios.post(`${baseUrl}/broadcast`, {
        data: body,
      });
      return response.data;
    } catch (error) {
      logging.error('fail sending message to web socket : ', error);
    }
  }
}
