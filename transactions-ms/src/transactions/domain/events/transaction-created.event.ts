import { Transaction } from '../entities/transaction.entity';

export class TransactionCreatedEvent {
  private readonly transactionExternalId: string;
  private readonly accountExternalIdDebit: string;
  private readonly accountExternalIdCredit: string;
  private readonly transferTypeId: number;
  private readonly value: number;

  constructor(transaction: Transaction) {
    this.transactionExternalId = transaction.getExternalId();
    this.accountExternalIdDebit = transaction.getSourceAccount();
    this.accountExternalIdCredit = transaction.getTargetAccount();
    this.transferTypeId = transaction.getType().getId();
    this.value = transaction.getAmount();
  }
}
