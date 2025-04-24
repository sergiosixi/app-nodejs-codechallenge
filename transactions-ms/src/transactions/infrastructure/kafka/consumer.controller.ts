import { Controller, Inject, ValidationPipe } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { LoggerService } from 'src/shared/infrastructure/services/logger/logger.service';
import { TYPES } from 'src/shared/infrastructure/utils/types';
import { UpdateStatusCommand } from 'src/transactions/application/commands/update-status.command';
import { TransactionStatusEventDto } from 'src/transactions/domain/dtos/transaction-status-event.dto';
import { TopicNames } from 'src/transactions/domain/enums/topic-names.enum';
import { TransactionStatus } from 'src/transactions/domain/enums/transaction-status.enum';
import { SchemaRegistryService } from 'src/shared/infrastructure/services/schema-registry/schema-registry.service';

@Controller()
export class ConsumerController {
  constructor(
    @Inject(TYPES.LoggerService)
    private readonly loggerService: LoggerService,
    private readonly commandBus: CommandBus,
    @Inject(TYPES.SchemaRegistryService)
    private readonly schemaRegistryService: SchemaRegistryService,
  ) {}

  @EventPattern(TopicNames.TRANSACTION_APPROVED)
  async handleTransactionApproved(@Payload(ValidationPipe) data: Buffer, @Ctx() context: KafkaContext): Promise<void> {
    try {
      this.loggerService.info(
        `Incoming message - Topic: ${context.getTopic()} - Partition: ${context.getPartition()} - Offset: ${context.getMessage().offset}`,
      );
      const decodedValue: TransactionStatusEventDto =
        await this.schemaRegistryService.decode<TransactionStatusEventDto>(data);
      const { transactionExternalId: id } = decodedValue;
      await this.commandBus.execute(new UpdateStatusCommand(id, TransactionStatus.APPROVED));
    } catch (e) {
      if (e instanceof Error) {
        this.loggerService.error(e.message);
      }
    } finally {
      await this.sendAck(context);
    }
  }

  @EventPattern(TopicNames.TRANSACTION_REJECTED)
  async handleTransactionRejected(@Payload(ValidationPipe) data: Buffer, @Ctx() context: KafkaContext): Promise<void> {
    try {
      this.loggerService.info(
        `Incoming message - Topic: ${context.getTopic()} - Partition: ${context.getPartition()} - Offset: ${context.getMessage().offset}`,
      );
      const decodedValue: TransactionStatusEventDto =
        await this.schemaRegistryService.decode<TransactionStatusEventDto>(data);
      const { transactionExternalId: id } = decodedValue;
      await this.commandBus.execute(new UpdateStatusCommand(id, TransactionStatus.APPROVED));
    } catch (e) {
      if (e instanceof Error) {
        this.loggerService.error(e.message);
      }
    } finally {
      await this.sendAck(context);
    }
  }

  private async sendAck(context: KafkaContext): Promise<void> {
    const consumer = context.getConsumer();
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    this.loggerService.info(`Send ack - Topic: ${topic} - Partition: ${partition} - Offset: ${offset}`);
    await consumer.commitOffsets([{ topic, partition, offset }]);
  }
}
