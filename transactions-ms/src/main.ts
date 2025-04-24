import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  const kafkaMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
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
