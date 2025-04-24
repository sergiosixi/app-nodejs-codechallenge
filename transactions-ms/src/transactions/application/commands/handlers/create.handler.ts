import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { EventService } from 'src/shared/infrastructure/services/events/event.service';
import { LoggerService } from 'src/shared/infrastructure/services/logger/logger.service';
import { TYPES as SHARED_TYPES } from 'src/shared/infrastructure/utils/types';
import { TransactionRequestDto } from 'src/transactions/domain/dtos/transaction-request.dto';
import { Transaction } from 'src/transactions/domain/entities/transaction.entity';
import { TopicNames } from 'src/transactions/domain/enums/topic-names.enum';
import { TransactionStatus } from 'src/transactions/domain/enums/transaction-status.enum';
import { TransactionCreatedEvent } from 'src/transactions/domain/events/transaction-created.event';
import { TransactionRepository } from 'src/transactions/domain/repositories/transaction.repository';
import { TYPES } from 'src/transactions/infrastructure/utils/types';
import { CreateCommand } from '../create.command';
import { SchemaRegistryService } from 'src/shared/infrastructure/services/schema-registry/schema-registry.service';

@Injectable()
@CommandHandler(CreateCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateCommand> {
  constructor(
    @Inject(SHARED_TYPES.LoggerService)
    private readonly loggerService: LoggerService,
    @Inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    @Inject(SHARED_TYPES.EventService)
    private readonly eventService: EventService,
  ) {}

  async execute(command: CreateCommand): Promise<boolean> {
    const { createTransactionDto } = command;
    const transaction: Transaction = this.mapDtoToDomain(createTransactionDto);
    try {
      await this.transactionRepository.create(transaction);
      await this.sendMessage(transaction);
      return true;
    } catch (e) {
      if (e instanceof Error) {
        this.loggerService.error(e.message);
      }
      return false;
    }
  }

  private async sendMessage(transaction: Transaction): Promise<void> {
    const transactionCreatedEvent = new TransactionCreatedEvent(transaction);
    await this.eventService.publish(transactionCreatedEvent, TopicNames.TRANSACTION_CREATED);
  }

  private mapDtoToDomain(transactionRequestDto: TransactionRequestDto): Transaction {
    return new Transaction({
      transactionExternalId: randomUUID(),
      sourceAccount: transactionRequestDto.accountExternalIdCredit,
      targetAccount: transactionRequestDto.accountExternalIdDebit,
      transactionType: {
        id: transactionRequestDto.transferTypeId,
      },
      transactionStatus: {
        id: TransactionStatus.PENDING,
      },
      value: transactionRequestDto.value,
      createdAt: new Date(),
    });
  }
}
