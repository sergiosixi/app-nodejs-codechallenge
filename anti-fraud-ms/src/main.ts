import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  await ConfigModule.envVariablesLoaded;
  const kafkaMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.KAFKA,
      options: {
        postfixId: '',
        client: {
          clientId: process.env.KAFKA_GROUP_ID,
          brokers: [process.env.KAFKA_BROKER || ''],
        },
        consumer: {
          groupId: process.env.KAFKA_GROUP_ID || '',
          retry: { retries: 3 },
        },
      },
    });
  await kafkaMicroservice.listen();
}
bootstrap();
