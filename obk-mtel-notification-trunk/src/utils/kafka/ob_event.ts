/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Kafka } from 'kafkajs';
import fs from 'fs';
import path from 'path';
import { get } from 'lodash';

export class OBEvent {
  private readonly kafka: Kafka;

  constructor() {
    let config = OBEvent.kafkaConfig;

    if (process.env.KAFKA_URL) {
      config = {
        ...config,
        brokers: process.env.KAFKA_URL.split(','),
      };
    }

    if (process.env.KAFKA_SSL) {
      config = {
        ...config,
        ssl: JSON.parse(process.env.KAFKA_SSL),
      };
    }

    if (process.env.KAFKA_SASL) {
      config = {
        ...config,
        sasl: JSON.parse(process.env.KAFKA_SASL),
      };
    }

    if (process.env.KAFKA_LOG) {
      config = {
        ...config,
        logLevel: process.env.KAFKA_LOG,
      };
    }

    console.dir(config, { depth: null });
    this.kafka = new Kafka(config);
  }

  public async send(topic: string, messages: any) {
    try {
      const producer = this.kafka.producer();

      await producer.connect();
      await producer.send({
        topic: topic,
        messages: [{ value: JSON.stringify(messages) }],
      });

      await producer.disconnect();
    } catch (error) {
      console.log(error);
    }
  }

  public isJSON(str: string) {
    try {
      return JSON.parse(str) && !!str;
    } catch (e) {
      return false;
    }
  }

  public async start(topics: string[], groupId: string, callback: Function) {
    try {
      const consumer = this.kafka.consumer({
        groupId,
      });
      await consumer.connect();
      await consumer.subscribe({ topics: topics });
      await consumer.run({
        eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
          const messageValue = get(message, 'value', '') as string;
          if (this.isJSON(messageValue)) {
            callback(
              { name: topic, payload: JSON.parse(messageValue) },
              { topic, partition, message, heartbeat, pause },
            );
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  static get kafkaConfigPath() {
    return process.env.OB_EVENT_CONFIG_PATH ?? 'event.config.json';
  }

  static get kafkaConfig() {
    const data = fs.readFileSync(path.join(process.cwd(), OBEvent.kafkaConfigPath), 'utf8');
    const config = JSON.parse(data);

    return config;
  }
}
