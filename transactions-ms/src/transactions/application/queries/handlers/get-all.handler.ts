import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionDto } from 'src/transactions/domain/dtos/transaction.dto';
import { Transaction } from 'src/transactions/domain/entities/transaction.entity';
import { TransactionRepository } from 'src/transactions/domain/repositories/transaction.repository';
import { TYPES } from 'src/transactions/infrastructure/utils/types';
import { GetAllQuery } from '../get-all.query';

export class TransactionsSearchParams {}

@QueryHandler(GetAllQuery)
export class GetAllHandler implements IQueryHandler<GetAllQuery> {
  constructor(
    @Inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(_query: GetAllQuery): Promise<TransactionDto[]> {
    const transactions: Transaction[] = await this.transactionRepository.getAll();
    return transactions.map((i) => this.mapEntityToDto(i));
  }

  private mapEntityToDto(transaction: Transaction): TransactionDto {
    return {
      transactionExternalId: transaction.getExternalId(),
      transactionType: {
        id: transaction.getType().getId(),
        name: transaction.getType().getName(),
      },
      transactionStatus: {
        id: transaction.getStatus().getId(),
        name: transaction.getStatus().getName(),
      },
      value: transaction.getAmount(),
      createdAt: transaction.getCreationDate(),
    };
  }
}
