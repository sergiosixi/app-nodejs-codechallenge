import { ValidateTransactionUseCase } from 'src/frauds/application/usecases/validate-transaction.usecase';
import { TransactionCreatedEventDto } from 'src/frauds/domain/dtos/transaction-created-event.dto';
import { Transaction } from 'src/frauds/domain/entities/transaction.entity';
import { TopicNames } from 'src/frauds/domain/enums/topic-names.enum';
import { TransactionApprovedEvent } from 'src/frauds/domain/events/transaction-approved.event';
import { EventService } from 'src/shared/infrastructure/services/events/event.service';

class MockEventService implements EventService {
  publish = jest.fn();
}

const mockEventService = new MockEventService();
describe('ValidateTransactionUseCase', () => {
  const instance = new ValidateTransactionUseCase(mockEventService);

  test('should instance the correct class', () => {
    expect(instance).toBeInstanceOf(ValidateTransactionUseCase);
  });

  test('should send approve transaction message', async () => {
    const transactionCreatedEventDto: TransactionCreatedEventDto = {
      transactionExternalId: '7cd12e1d-2ea1-476e-888b-51aee0cf79ca',
      accountExternalIdDebit: '417beaeb-858e-4390-a88b-4343cbcb9ce8',
      accountExternalIdCredit: '02f413eb-bae1-4566-a604-6923e6c7b090',
      transferTypeId: 1,
      value: 200,
    };

    const expectedMessagedSent: TransactionApprovedEvent = new TransactionApprovedEvent(
      new Transaction({
        transactionExternalId: transactionCreatedEventDto.transactionExternalId,
        sourceAccount: transactionCreatedEventDto.accountExternalIdCredit,
        targetAccount: transactionCreatedEventDto.accountExternalIdDebit,
        value: transactionCreatedEventDto.value,
        transactionType: {
          id: transactionCreatedEventDto.transferTypeId,
        },
      }),
    );

    await instance.execute(transactionCreatedEventDto);
    expect(mockEventService.publish).toHaveBeenCalledWith(expectedMessagedSent, TopicNames.TRANSACTION_APPROVED);
  });

  test('should send rejected transaction message', async () => {
    const transactionCreatedEventDto: TransactionCreatedEventDto = {
      transactionExternalId: '7cd12e1d-2ea1-476e-888b-51aee0cf79ca',
      accountExternalIdDebit: '417beaeb-858e-4390-a88b-4343cbcb9ce8',
      accountExternalIdCredit: '02f413eb-bae1-4566-a604-6923e6c7b090',
      transferTypeId: 1,
      value: 2000,
    };

    const expectedMessagedSent: TransactionApprovedEvent = new TransactionApprovedEvent(
      new Transaction({
        transactionExternalId: transactionCreatedEventDto.transactionExternalId,
        sourceAccount: transactionCreatedEventDto.accountExternalIdCredit,
        targetAccount: transactionCreatedEventDto.accountExternalIdDebit,
        value: transactionCreatedEventDto.value,
        transactionType: {
          id: transactionCreatedEventDto.transferTypeId,
        },
      }),
    );

    await expect(instance.execute(transactionCreatedEventDto)).rejects.toThrow(
      'The transaction value exceeds the limit',
    );
    expect(mockEventService.publish).toHaveBeenCalledWith(expectedMessagedSent, TopicNames.TRANSACTION_REJECTED);
  });
});
