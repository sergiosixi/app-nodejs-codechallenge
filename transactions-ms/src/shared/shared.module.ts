import { Module } from '@nestjs/common';
import { WinstonLoggerService } from './infrastructure/services/logger/winston-logger.service';
import { TYPES } from './infrastructure/utils/types';
import { PostgresDbClientProvider } from './infrastructure/providers/postgres-db-client.provider';
import { KafkaService } from './infrastructure/services/events/kafka.service';
import { ConfluentSchemaRegistry } from './infrastructure/services/schema-registry/confluent-schema-registry.service';

@Module({
  providers: [
    PostgresDbClientProvider,
    {
      provide: TYPES.LoggerService,
      useClass: WinstonLoggerService,
    },
    {
      provide: TYPES.EventService,
      useClass: KafkaService,
    },
    {
      provide: TYPES.SchemaRegistryService,
      useClass: ConfluentSchemaRegistry,
    },
  ],
  exports: [
    PostgresDbClientProvider,
    {
      provide: TYPES.LoggerService,
      useClass: WinstonLoggerService,
    },
    {
      provide: TYPES.EventService,
      useClass: KafkaService,
    },
    {
      provide: TYPES.SchemaRegistryService,
      useClass: ConfluentSchemaRegistry,
    },
  ],
})
export class SharedModule {}
