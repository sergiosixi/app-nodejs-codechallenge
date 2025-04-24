import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EventService } from './event.service';
import { Kafka, Message, Partitioners, Producer } from 'kafkajs';
import { TYPES } from '../../utils/types';
import { LoggerService } from '../logger/logger.service';
import { SchemaRegistryService } from '../schema-registry/schema-registry.service';

@Injectable()
export class KafkaService implements EventService, OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;

  constructor(
    @Inject(TYPES.LoggerService)
    private readonly loggerService: LoggerService,
    @Inject(TYPES.SchemaRegistryService)
    private readonly schemaRegistryService: SchemaRegistryService,
  ) {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKER || ''],
    });
    this.producer = this.getProducer();
  }
  async onModuleInit() {
    await this.producer.connect();
  }

  async publish(payload: any, topic: string): Promise<void> {
    try {
      const message: Message = await this.formatMessage(payload, topic);
      await this.producer.send({ topic, messages: [message] });
      this.loggerService.info(`Nuevos mensajes emitidos al tópico ${topic}`);
    } catch (error) {
      this.loggerService.error(error.message);
    }
  }

  private async formatMessage(payload: any, topic: string): Promise<Message> {
    const encodedPayload = await this.schemaRegistryService.encode(payload, topic);
    return { value: encodedPayload };
  }

  private getProducer() {
    return this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }
}
