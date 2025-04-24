import { TransactionTypeDto } from '../dtos/transaction.dto';

export class TransactionType {
  private id: number;
  private name: string;
  constructor(transactionTypeDto: TransactionTypeDto) {
    if (transactionTypeDto.id) this.id = transactionTypeDto.id;
    if (transactionTypeDto.name) this.name = transactionTypeDto.name;
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
}
