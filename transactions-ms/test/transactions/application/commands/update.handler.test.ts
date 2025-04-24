import { CreateCommand } from 'src/transactions/application/commands/create.command';
import { EventService } from '../../../../src/shared/infrastructure/services/events/event.service';
import { LoggerService } from '../../../../src/shared/infrastructure/services/logger/logger.service';
import { CreateTransactionHandler } from '../../../../src/transactions/application/commands/handlers/create.handler';
import { TransactionRepository } from '../../../../src/transactions/domain/repositories/transaction.repository';
import { UpdateStatusHandler } from 'src/transactions/application/commands/handlers/update-status.handler';
import { UpdateStatusCommand } from 'src/transactions/application/commands/update-status.command';
import { TransactionStatus } from 'src/transactions/domain/enums/transaction-status.enum';

class MockTransactionRepository implements TransactionRepository {
  getAll = jest.fn();
  create = jest.fn();
  updateStatus = jest.fn();
}

class MockLoggerService implements LoggerService {
  info = jest.fn();
  debug = jest.fn();
  error = jest.fn();
}

const mockTransactionRepository = new MockTransactionRepository();
const mockLoggerService = new MockLoggerService();
describe('UpdateStatusHandler', () => {
  const instance = new UpdateStatusHandler(mockTransactionRepository, mockLoggerService);

  test('should instance the correct class', () => {
    expect(instance).toBeInstanceOf(UpdateStatusHandler);
  });

  test('should update a transaction status', async () => {
    const expectedResult = true;
    const id = '417beaeb-858e-4390-a88b-4343cbcb9ce8';
    const status = TransactionStatus.APPROVED;
    const updateStatusCommand: UpdateStatusCommand = new UpdateStatusCommand(id, status);
    const result = await instance.execute(updateStatusCommand);
    expect(result).toEqual(expectedResult);
  });

  test('should not update a transaction status', async () => {
    const expectedResult = false;
    const id = '417beaeb-858e-4390-a88b-4343cbcb9ce8';
    const status = TransactionStatus.APPROVED;
    const updateStatusCommand: UpdateStatusCommand = new UpdateStatusCommand(id, status);
    mockTransactionRepository.updateStatus.mockImplementation(() => {
      throw new Error('Test error');
    });
    const result = await instance.execute(updateStatusCommand);
    expect(result).toEqual(expectedResult);
  });
});
