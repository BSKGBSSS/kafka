import { Logger } from '@nestjs/common';
import { IProducer } from '../interfaces/producer.interface';
import { CompressionTypes, Kafka, Message, Producer } from 'kafkajs';

export class KafkaProducer implements IProducer {
  private readonly logger = new Logger(KafkaProducer.name, { timestamp: true });
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private connected: boolean = false;

  constructor(
    private readonly broker: string,
    private readonly topic: string,
  ) {
    this.kafka = new Kafka({
      brokers: [this.broker],
    });
    this.producer = this.kafka.producer();
  }

  async produce(
    message: Message,
    compression?: CompressionTypes,
    acks?: number,
    timeout?: number,
  ) {
    await this.producer.send({
      topic: this.topic,
      messages: [message],
      compression,
      timeout,
      acks,
    });
  }

  async connect() {
    try {
      this.producer.on('producer.connect', () => {
        this.logger.log(
          `producer connected. broker: ${this.broker} topic: ${this.topic}`,
        );
        this.connected = true;
      });

      this.producer.on('producer.disconnect', () => {
        this.logger.log(
          `producer disconnected. broker: ${this.broker} topic: ${this.topic}`,
        );
        this.connected = false;
      });

      await this.producer.connect();
    } catch (err) {
      this.logger.error(
        `failed to connect to kafka. broker: ${this.broker} topic: ${this.topic}`,
        err,
      );
    }
  }

  async disconnect() {
    await this.producer.disconnect();
  }

  isConnected(): boolean {
    return this.connected;
  }
}
