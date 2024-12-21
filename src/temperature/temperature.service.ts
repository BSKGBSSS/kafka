import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerService } from 'src/consumer/consumer.service';
import { ConsumerMessage } from 'src/interfaces/consumer.interface';
import { ProducerService } from 'src/producer/producer.service';

@Injectable()
export class TemperatureService implements OnModuleInit {
  private readonly logger = new Logger(TemperatureService.name, {
    timestamp: true,
  });
  private readonly producerService: ProducerService;
  private readonly consumerService: ConsumerService;

  constructor(private readonly configService: ConfigService) {
    this.producerService = new ProducerService(
      this.configService.get('KAFKA_BROKER'),
      this.configService.get('KAFKA_TOPIC'),
    );

    this.consumerService = new ConsumerService(
      this.configService.get('KAFKA_BROKER'),
      this.configService.get('KAFKA_TOPIC'),
      'temperature-consumer',
    );
  }

  async registerTemperature(temperature: number) {
    const message = {
      temperature,
      timeStamp: new Date(),
    };

    await this.producerService.produce({
      value: JSON.stringify(message),
    });
  }

  async handleTemperatureReading() {
    await this.consumerService.consume(async (message: ConsumerMessage) => {
      this.logger.log(message);
      // TODO  handle consumed message
    });
  }

  // Called when the application starts, only for testing purposes
  async onModuleInit() {
    await this.registerTemperature(30);
    // await this.handleTemperatureReading();
  }
}
