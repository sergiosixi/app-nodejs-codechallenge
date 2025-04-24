import { TransactionRequestDto } from 'src/transactions/domain/dtos/transaction-request.dto';

export class CreateCommand {
  constructor(public readonly createTransactionDto: TransactionRequestDto) {}
}
