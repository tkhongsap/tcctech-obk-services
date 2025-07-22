import { OBEvent } from '../ob_event';

test('should read kafka config from env', () => {
  expect(OBEvent.kafkaConfig).toEqual({
    "clientId": "ob-event",
    "brokers": [
      "localhost:9092"
    ]
  });
});
