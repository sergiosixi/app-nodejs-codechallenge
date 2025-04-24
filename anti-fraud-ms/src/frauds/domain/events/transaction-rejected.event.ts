import { Transaction } from '../entities/transaction.entity';

export class TransactionRejectedEvent {
  private readonly transactionExternalId: string;

  constructor(transaction: Transaction) {
    this.transactionExternalId = transaction.getId();
  }
}
