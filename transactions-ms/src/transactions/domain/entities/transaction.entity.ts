import { TransactionDto } from '../dtos/transaction.dto';
import { TransactionStatus } from './transaction-status.entity';
import { TransactionType } from './transaction-type.entity';

export class Transaction {
  private externalId: string;
  private sourceAccount: string;
  private targetAccount: string;
  private type: TransactionType;
  private status: TransactionStatus;
  private amount: number;
  private creationDate: Date;

  constructor(transactionDto: TransactionDto) {
    if (transactionDto.transactionExternalId) this.externalId = transactionDto.transactionExternalId;
    if (transactionDto.sourceAccount) this.sourceAccount = transactionDto.sourceAccount;
    if (transactionDto.targetAccount) this.targetAccount = transactionDto.targetAccount;
    if (transactionDto.transactionType) this.type = new TransactionType(transactionDto.transactionType);
    if (transactionDto.transactionStatus) this.status = new TransactionStatus(transactionDto.transactionStatus);
    if (transactionDto.value) this.amount = transactionDto.value;
    if (transactionDto.createdAt) this.creationDate = transactionDto.createdAt;
  }

  public getExternalId(): string {
    return this.externalId;
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
  public getStatus(): TransactionStatus {
    return this.status;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }
}
