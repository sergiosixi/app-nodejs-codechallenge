import { TransactionStatus } from 'src/transactions/domain/enums/transaction-status.enum';

export class UpdateStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: TransactionStatus,
  ) {}
}
