import ReconnectingWebSocket from 'reconnecting-websocket';
import authenState from '~/states/authen/authenState';
import Config from 'react-native-config';
import {Notifier} from 'react-native-notifier';
import InAppNotification from '~/components/organisms/InAppNotification';
import {WEBSOCKET_TYPE} from './constants/WebSocketType';

export default function WebSocketService(callback?: Function) {
  const rws = new ReconnectingWebSocket(Config.WEBSOCKET_BASEURL!);

  rws.addEventListener('open', () => {
    rws.send(
      JSON.stringify({action: 'connect', deviceId: authenState.deviceId.value}),
    );
    rws.send(
      JSON.stringify({
        action: 'register',
        deviceId: authenState.deviceId.value,
      }),
    );
  });

  rws.addEventListener('message', messageEvent => {
    const data = JSON.parse(messageEvent.data);
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
      default:
        break;
    }
  });
}
