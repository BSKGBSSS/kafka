import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [
    ConsumerService,
    {
      provide: 'broker',
      useValue: 'default-broker-value',
    },
    {
      provide: 'topic',
      useValue: 'default-topic-value',
    },
    {
      provide: 'groupId',
      useValue: 'default-groupId-value',
    },
  ],
  exports: [ConsumerService],
})
export class ConsumerModule {}
