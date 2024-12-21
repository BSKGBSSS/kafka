import { Module } from '@nestjs/common';
import { TemperatureService } from './temperature.service';
import { ProducerModule } from 'src/producer/producer.module';
import { ConsumerModule } from 'src/consumer/consumer.module';

@Module({
  imports: [ProducerModule, ConsumerModule],
  providers: [TemperatureService],
})
export class TemperatureModule {}
