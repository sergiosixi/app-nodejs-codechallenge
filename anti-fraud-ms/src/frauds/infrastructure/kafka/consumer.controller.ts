import { Controller, Inject, ValidationPipe } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { TYPES } from '../../../shared/infrastructure/utils/types';
import { LoggerService } from '../../../shared/infrastructure/services/logger/logger.service';
import { TransactionCreatedEventDto } from 'src/frauds/domain/dtos/transaction-created-event.dto';
import { ValidateTransactionUseCase } from 'src/frauds/application/usecases/validate-transaction.usecase';
import { TopicNames } from 'src/frauds/domain/enums/topic-names.enum';
import { SchemaRegistryService } from 'src/shared/infrastructure/services/schema-registry/schema-registry.service';

@Controller()
export class ConsumerController {
  constructor(
    @Inject(TYPES.LoggerService)
    private readonly loggerService: LoggerService,
    private readonly validateTransactionUseCase: ValidateTransactionUseCase,
    @Inject(TYPES.SchemaRegistryService)
    private readonly schemaRegistryService: SchemaRegistryService,
  ) {}

  @EventPattern(TopicNames.TRANSACTION_CREATED)
  async handleTransactionCreated(@Payload(ValidationPipe) data: Buffer, @Ctx() context: KafkaContext): Promise<void> {
    try {
      this.loggerService.info(
        `Incoming message - Topic: ${context.getTopic()} - Partition: ${context.getPartition()} - Offset: ${context.getMessage().offset}`,
      );
      const decodedValue: TransactionCreatedEventDto =
        await this.schemaRegistryService.decode<TransactionCreatedEventDto>(data);

      await this.validateTransactionUseCase.execute(decodedValue);
    } catch (error) {
      this.loggerService.error(error.message, error.stack);
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
