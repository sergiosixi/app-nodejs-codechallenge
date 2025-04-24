import { CreateCommand } from 'src/transactions/application/commands/create.command';
import { EventService } from '../../../../src/shared/infrastructure/services/events/event.service';
import { LoggerService } from '../../../../src/shared/infrastructure/services/logger/logger.service';
import { CreateTransactionHandler } from '../../../../src/transactions/application/commands/handlers/create.handler';
import { TransactionRepository } from '../../../../src/transactions/domain/repositories/transaction.repository';

class MockTransactionRepository implements TransactionRepository {
  getAll = jest.fn();
  create = jest.fn();
  updateStatus = jest.fn();
}

class MockEventService implements EventService {
  publish = jest.fn();
}

class MockLoggerService implements LoggerService {
  info = jest.fn();
  debug = jest.fn();
  error = jest.fn();
}

const mockTransactionRepository = new MockTransactionRepository();
const mockEventService = new MockEventService();
const mockLoggerService = new MockLoggerService();
describe('CreateTransactionHandler', () => {
  const instance = new CreateTransactionHandler(mockLoggerService, mockTransactionRepository, mockEventService);

  test('should instance the correct class', () => {
    expect(instance).toBeInstanceOf(CreateTransactionHandler);
  });

  test('should create a transaction and send message', async () => {
    const expectedResult = true;
    const createCommand: CreateCommand = new CreateCommand({
      accountExternalIdDebit: '417beaeb-858e-4390-a88b-4343cbcb9ce8',
      accountExternalIdCredit: '02f413eb-bae1-4566-a604-6923e6c7b090',
      transferTypeId: 1,
      value: 200,
    });
    const result = await instance.execute(createCommand);
    expect(result).toEqual(expectedResult);
  });

  test('should not create a transaction and neither send message', async () => {
    const expectedResult = false;
    const createCommand: CreateCommand = new CreateCommand({
      accountExternalIdDebit: '417beaeb-858e-4390-a88b-4343cbcb9ce8',
      accountExternalIdCredit: '02f413eb-bae1-4566-a604-6923e6c7b090',
      transferTypeId: 1,
      value: 200,
    });
    mockTransactionRepository.create.mockImplementation(() => {
      throw new Error('Test error');
    });
    const result = await instance.execute(createCommand);
    expect(result).toEqual(expectedResult);
  });
});
