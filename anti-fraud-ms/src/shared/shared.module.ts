import { Module } from '@nestjs/common';
import { TYPES } from './infrastructure/utils/types';
import { WinstonLoggerService } from './infrastructure/services/logger/winston-logger.service';
import { KafkaService } from './infrastructure/services/events/kafka.service';
import { ConfluentSchemaRegistry } from './infrastructure/services/schema-registry/confluent-schema-registry.service';

@Module({
  providers: [
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
