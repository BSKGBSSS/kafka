import { Module } from '@nestjs/common';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ProducerService } from './producer.service';

@Module({
  imports: [KafkaModule],
  providers: [
    ProducerService,
    {
      provide: 'broker',
      useValue: 'default-broker-value',
    },
    {
      provide: 'topic',
      useValue: 'default-topic-value',
    },
  ],
  exports: [ProducerService],
})
export class ProducerModule {}
