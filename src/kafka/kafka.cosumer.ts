import { Logger } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { OnMessage, IConsumer } from 'src/interfaces/consumer.interface';

export class KafkaConsumer implements IConsumer {
  private readonly logger = new Logger(KafkaConsumer.name, { timestamp: true });
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private connected: boolean = false;

  constructor(
    private readonly broker: string,
    private readonly topic: string,
    private readonly groupId: string,
  ) {
    if (this.broker && this.topic && this.groupId) {
      this.kafka = new Kafka({
        brokers: [this.broker],
      });
      this.consumer = this.kafka.consumer({ groupId: this.groupId });
    } else {
      this.logger.warn('Broker, topic and groupId must be provided');
    }
  }

  async consume(onMessage: OnMessage) {
    await this.consumer.subscribe({ topic: this.topic });

    await this.consumer.run({
      eachMessage: async (payload) => {
        try {
          this.logger.log(
            `message: ${payload.message.value.toString()} (topic: ${payload.topic}, partition: ${payload.partition})`,
          );

          await onMessage({
            key: payload.message.key?.toString(),
            value: payload.message.value.toString(),
          });
        } catch (err) {
          this.logger.error('error on consuming message', err);
        }
      },
    });
  }

  async connect() {
    try {
      this.consumer.on('consumer.connect', () => {
        this.logger.log(
          `consumer connected. broker: ${this.broker} topic: ${this.topic}`,
        );
        this.connected = true;
      });

      this.consumer.on('consumer.disconnect', () => {
        this.logger.log(
          `consumer disconnected. broker: ${this.broker} topic: ${this.topic}`,
        );
        this.connected = false;
      });

      await this.consumer.connect();
    } catch (err) {
      this.logger.error(
        `failed to connect to kafka. broker: ${this.broker} topic: ${this.topic}`,
        err,
      );
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }

  isConnected(): boolean {
    return this.connected;
  }
}
