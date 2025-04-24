import { Transaction } from 'src/transactions/domain/entities/transaction.entity';

export const transactionsMock = [
  new Transaction({
    transactionExternalId: '57b71ad9-d3fd-49ac-8927-62cd915defb6',
    sourceAccount: '02f413eb-bae1-4566-a604-6923e6c7b090',
    targetAccount: '417beaeb-858e-4390-a88b-4343cbcb9ce8',
    transactionType: { id: 1, name: 'p2p' },
    transactionStatus: { id: 2, name: 'approved' },
    value: 120,
    createdAt: new Date('2025-04-24T06:39:26.359Z'),
  }),
  new Transaction({
    transactionExternalId: '8ad7babf-1836-4428-98b7-747e3da416fc',
    sourceAccount: '02f413eb-bae1-4566-a604-6923e6c7b090',
    targetAccount: '417beaeb-858e-4390-a88b-4343cbcb9ce8',
    transactionType: { id: 1, name: 'p2p' },
    transactionStatus: { id: 2, name: 'approved' },
    value: 200,
    createdAt: new Date('2025-04-24T06:39:26.488Z'),
  }),
];
