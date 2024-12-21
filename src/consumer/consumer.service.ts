import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { IConsumer, OnMessage } from '../interfaces/consumer.interface';
import { KafkaConsumer } from 'src/kafka/kafka.cosumer';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumer: IConsumer;

  constructor(
    @Inject('broker') broker: string,
    @Inject('topic') topic: string,
    @Inject('groupId') groupId: string,
  ) {
    this.consumer = new KafkaConsumer(broker, topic, groupId);
  }

  async consume(onMessage: OnMessage) {
    if (!this.consumer.isConnected()) {
      await this.consumer.connect();
    }
    await this.consumer.consume(onMessage);
  }

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }
}
