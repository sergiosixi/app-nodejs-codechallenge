import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommand } from 'src/transactions/application/commands/create.command';
import { GetAllQuery } from 'src/transactions/application/queries/get-all.query';
import { TransactionRequestDto } from 'src/transactions/domain/dtos/transaction-request.dto';
import { TransactionDto } from 'src/transactions/domain/dtos/transaction.dto';
import { CreateTransactionInput } from '../dtos/create-transaction.input';
import { TransactionStatus } from '../entities/transaction-status.entity';
import { TransactionType } from '../entities/transaction-type.entity';
import { Transaction } from '../entities/transaction.entity';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [Transaction], { name: 'getAllTransactions' })
  async getAll(): Promise<Transaction[]> {
    const response: TransactionDto[] = await this.queryBus.execute(new GetAllQuery());
    return response.map((i) => this.mapDtoToEntity(i));
  }

  @Mutation(() => Boolean)
  async createTransaction(
    @Args('createTransactionInput', { type: () => CreateTransactionInput })
    createTransactionInput: CreateTransactionInput,
  ): Promise<boolean> {
    const transactionRequestDto: TransactionRequestDto = {
      accountExternalIdDebit: createTransactionInput.accountExternalIdDebit,
      accountExternalIdCredit: createTransactionInput.accountExternalIdCredit,
      transferTypeId: createTransactionInput.tranferTypeId,
      value: createTransactionInput.value,
    };

    return this.commandBus.execute(new CreateCommand(transactionRequestDto));
  }

  private mapDtoToEntity(transactionDto: TransactionDto): Transaction {
    const transaction = new Transaction();
    transaction.externalId = String(transactionDto.transactionExternalId);
    transaction.value = transactionDto.value;
    transaction.createdAt = transactionDto.createdAt;
    const transactionType = new TransactionType();
    transactionType.id = Number(transactionDto.transactionType.id);
    transactionType.name = String(transactionDto.transactionType.name);
    transaction.transactionType = transactionType;
    const transactionStatus = new TransactionStatus();
    transactionStatus.id = Number(transactionDto.transactionStatus?.id);
    transactionStatus.name = String(transactionDto.transactionStatus?.name);
    transaction.transactionStatus = transactionStatus;

    return transaction;
  }
}
