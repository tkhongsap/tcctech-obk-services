import ReconnectingWebSocket from 'reconnecting-websocket';
import authenState from '~/states/authen/authenState';
import Config from 'react-native-config';
import {Notifier} from 'react-native-notifier';
import InAppNotification from '~/components/organisms/InAppNotification';
import {WEBSOCKET_TYPE} from './constants/WebSocketType';
import firebaseConfigState from '~/states/firebase';

export default function WebSocketService(callback?: Function) {
  const rws = new ReconnectingWebSocket(Config.WEBSOCKET_BASEURL!);

  let heartbeatInterval: number;
  let pongTimeout: number;
  const heartbeatIntervalTime = firebaseConfigState.heartbeat_interval.value;
  const heartbeatTimeout = firebaseConfigState.heartbeat_timeout.value;

  rws.addEventListener('open', () => {
    rws.send(
      JSON.stringify({
        action: 'connect',
        deviceId: authenState.deviceId.value,
      }),
    );
  });

  heartbeatInterval = setInterval(() => {
    if (rws.readyState === WebSocket.OPEN) {
      rws.send(JSON.stringify({action: 'ping'}));

      pongTimeout = setInterval(() => {
        rws.close();
      }, heartbeatTimeout);
    }
  }, heartbeatIntervalTime);

  rws.addEventListener('close', () => {
    clearInterval(heartbeatInterval);
  });

  rws.addEventListener('message', messageEvent => {
    const data = JSON.parse(messageEvent.data);
    if (data.action === 'pong') {
      clearTimeout(pongTimeout);
    } else {
      switch (data.data.type) {
        case WEBSOCKET_TYPE.NOTIFICATION:
          Notifier.showNotification({
            title: data.data.title,
            description: data.data.description,
            componentProps: {
              createdAt: data.data.created_at,
            },
            Component: InAppNotification,
            containerStyle: {
              paddingTop: 20,
            },
            onPress: () => callback && callback(data.data),
            hideOnPress: true,
          });
          break;
        case WEBSOCKET_TYPE.LIFTCALLED:
          if (callback) {
            callback(data.data);
          }
          break;
        case WEBSOCKET_TYPE.PARKING_AVAILABILITY:
          if (callback) {
            callback(data.data);
          }
          break;
        case WEBSOCKET_TYPE.SHUTTLE_BUS_UPDATED:
          if (callback) {
            callback(data.data);
          }
          break;
        case WEBSOCKET_TYPE.VALET_STATUS_UPDATED:
          if (callback) {
            callback(data.data);
          }
          break;
        case WEBSOCKET_TYPE.NOTIFICATION_COUNTING_UPDATED:
          if (callback) {
            callback(data.data);
          }
          break;
        default:
          break;
      }
    }
  });
}
