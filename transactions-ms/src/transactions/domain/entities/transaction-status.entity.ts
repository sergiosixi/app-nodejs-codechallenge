import { TransactionStatusDto } from '../dtos/transaction.dto';

export class TransactionStatus {
  private id: number;
  private name: string;
  constructor(transactionStatusDto: TransactionStatusDto) {
    if (transactionStatusDto.id) this.id = transactionStatusDto.id;
    if (transactionStatusDto.name) this.name = transactionStatusDto.name;
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
}
