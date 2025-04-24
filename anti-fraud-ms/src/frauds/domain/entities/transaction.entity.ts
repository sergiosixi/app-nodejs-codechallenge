import { TRANSACTION_AMOUNT_MAX_LIMIT } from '../constants';
import { TransactionDto } from '../dtos/transaction.dto';
import { TransactionType } from './transaction-type.entity';

export class Transaction {
  private id: string;
  private sourceAccount: string;
  private targetAccount: string;
  private type: TransactionType;
  private amount: number;

  constructor(transactionDto: TransactionDto) {
    if (transactionDto.transactionExternalId)
      this.id = transactionDto.transactionExternalId;
    if (transactionDto.sourceAccount)
      this.sourceAccount = transactionDto.sourceAccount;
    if (transactionDto.targetAccount)
      this.targetAccount = transactionDto.targetAccount;
    if (transactionDto.transactionType)
      this.type = new TransactionType(transactionDto.transactionType);
    if (transactionDto.value) this.amount = transactionDto.value;
  }

  public getId(): string {
    return this.id;
  }

  public getSourceAccount(): string {
    return this.sourceAccount;
  }

  public getTargetAccount(): string {
    return this.targetAccount;
  }

  public getType(): TransactionType {
    return this.type;
  }

  public getAmount(): number {
    return this.amount;
  }

  public limitExceeded(): boolean {
    return this.amount > TRANSACTION_AMOUNT_MAX_LIMIT;
  }
}
