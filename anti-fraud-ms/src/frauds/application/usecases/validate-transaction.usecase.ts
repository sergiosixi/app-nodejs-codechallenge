import { Inject, Injectable } from '@nestjs/common';
import { TransactionCreatedEventDto } from 'src/frauds/domain/dtos/transaction-created-event.dto';
import { Transaction } from 'src/frauds/domain/entities/transaction.entity';
import { TopicNames } from 'src/frauds/domain/enums/topic-names.enum';
import { TransactionApprovedEvent } from 'src/frauds/domain/events/transaction-approved.event';
import { TransactionRejectedEvent } from 'src/frauds/domain/events/transaction-rejected.event';
import { ValueLimitExceededException } from 'src/frauds/domain/exceptions/value-limit-exceeded.exception';
import { EventService } from 'src/shared/infrastructure/services/events/event.service';
import { TYPES } from 'src/shared/infrastructure/utils/types';

@Injectable()
export class ValidateTransactionUseCase {
  constructor(
    @Inject(TYPES.EventService)
    private readonly eventService: EventService,
  ) {}

  async execute(transactionCreatedEventDto: TransactionCreatedEventDto): Promise<void> {
    const transaction: Transaction = this.mapDtoToEntity(transactionCreatedEventDto);

    if (transaction.limitExceeded()) {
      await this.sendRejectedMessage(transaction);
      throw new ValueLimitExceededException();
    } else {
      await this.sendApprovedMessage(transaction);
    }
  }

  private async sendApprovedMessage(transaction: Transaction): Promise<void> {
    const transactionApprovedEvent = new TransactionApprovedEvent(transaction);
    await this.eventService.publish(transactionApprovedEvent, TopicNames.TRANSACTION_APPROVED);
  }

  private async sendRejectedMessage(transaction: Transaction): Promise<void> {
    const transactionRejectedEvent = new TransactionRejectedEvent(transaction);
    await this.eventService.publish(transactionRejectedEvent, TopicNames.TRANSACTION_REJECTED);
  }

  private mapDtoToEntity(transactionCreatedEventDto: TransactionCreatedEventDto): Transaction {
    return new Transaction({
      transactionExternalId: transactionCreatedEventDto.transactionExternalId,
      sourceAccount: transactionCreatedEventDto.accountExternalIdCredit,
      targetAccount: transactionCreatedEventDto.accountExternalIdDebit,
      value: transactionCreatedEventDto.value,
      transactionType: {
        id: transactionCreatedEventDto.transferTypeId,
      },
    });
  }
}
