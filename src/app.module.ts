import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProducerModule } from './producer/producer.module';
import { ConsumerModule } from './consumer/consumer.module';
import { TemperatureModule } from './temperature/temperature.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProducerModule,
    ConsumerModule,
    TemperatureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
