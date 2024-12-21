import { Module } from '@nestjs/common';
import { KafkaProducer } from './kafka.producer';
import { KafkaConsumer } from './kafka.cosumer';

@Module({
  imports: [],
  providers: [KafkaProducer, KafkaConsumer],
  exports: [KafkaProducer, KafkaConsumer],
})
export class KafkaModule {}
