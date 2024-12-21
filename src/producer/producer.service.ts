import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { IProducer } from '../interfaces/producer.interface';
import { KafkaProducer } from '../kafka/kafka.producer';

@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly producer: IProducer;

  constructor(
    @Inject('broker') broker: string,
    @Inject('topic') topic: string,
  ) {
    this.producer = new KafkaProducer(broker, topic);
  }

  async produce(message: { key?: string; value: string }) {
    if (!this.producer.isConnected()) {
      await this.producer.connect();
    }
    await this.producer.produce(message);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
