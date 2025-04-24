import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { Injectable } from '@nestjs/common';
import { SchemaRegistryService } from './schema-registry.service';
import { toPascalCase } from '../../utils';

@Injectable()
export class ConfluentSchemaRegistry implements SchemaRegistryService {
  private registry: SchemaRegistry;

  constructor() {
    this.registry = new SchemaRegistry({
      host: process.env.KAFKA_SCHEMA_REGISTRY_HOST || '',
    });
  }

  decode<T>(message: Buffer): Promise<T> {
    return this.registry.decode(message);
  }

  async encode(message: Buffer, topic: string): Promise<Buffer> {
    const topicPascalCase = toPascalCase(topic);
    const topicValue = `${topicPascalCase}Value`;
    const lastSchemaId = await this.registry.getLatestSchemaId(topicValue);
    return this.registry.encode(lastSchemaId, message);
  }
}
