import { GetAllQuery } from 'src/transactions/application/queries/get-all.query';
import { GetAllHandler } from 'src/transactions/application/queries/handlers/get-all.handler';
import { TransactionRepository } from '../../../../src/transactions/domain/repositories/transaction.repository';
import { transactionsMock } from '../../mocks/transactions.mock';
import { TransactionDto } from 'src/transactions/domain/dtos/transaction.dto';

class MockTransactionRepository implements TransactionRepository {
  getAll = jest.fn();
  create = jest.fn();
  updateStatus = jest.fn();
}

const mockTransactionRepository = new MockTransactionRepository();
describe('GetAllHandler', () => {
  const instance = new GetAllHandler(mockTransactionRepository);

  test('should instance the correct class', () => {
    expect(instance).toBeInstanceOf(GetAllHandler);
  });

  test('should get all transactions', async () => {
    const expectedResult: TransactionDto[] = [
      {
        transactionExternalId: '57b71ad9-d3fd-49ac-8927-62cd915defb6',
        transactionType: { id: 1, name: 'p2p' },
        transactionStatus: { id: 2, name: 'approved' },
        value: 120,
        createdAt: new Date('2025-04-24T06:39:26.359Z'),
      },
      {
        transactionExternalId: '8ad7babf-1836-4428-98b7-747e3da416fc',
        transactionType: { id: 1, name: 'p2p' },
        transactionStatus: { id: 2, name: 'approved' },
        value: 200,
        createdAt: new Date('2025-04-24T06:39:26.488Z'),
      },
    ];
    mockTransactionRepository.getAll.mockResolvedValue(transactionsMock);
    const getAllQuery: GetAllQuery = new GetAllQuery();
    const result = await instance.execute(getAllQuery);
    expect(result).toEqual(expectedResult);
  });
});
