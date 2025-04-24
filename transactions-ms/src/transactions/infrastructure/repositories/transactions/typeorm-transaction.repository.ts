import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/infrastructure/services/logger/logger.service';
import { TYPES } from 'src/shared/infrastructure/utils/types';
import { PostgresDbClient } from 'src/shared/infrastructure/db/typeorm/postgres-db.client';
import { Transaction } from 'src/transactions/domain/entities/transaction.entity';
import { TransactionRepository } from 'src/transactions/domain/repositories/transaction.repository';
import { Transaction as TransactionEntity } from './transaction.entity';
import { TransactionMapper } from './transaction.mapper';

@Injectable()
export class TypeOrmTransactionRepository implements TransactionRepository {
  constructor(
    @Inject(TYPES.LoggerService)
    private readonly loggerService: LoggerService,
    private readonly dbClient: PostgresDbClient,
  ) {}

  async getAll(): Promise<Transaction[]> {
    const queryName = 'GET_ALL_TRANSACTIONS';
    const dataSource = this.dbClient.getDataSource();
    const func = async () => dataSource.manager.find(TransactionEntity);
    const response: TransactionEntity[] = await this.dbClient.executeQuery<TransactionEntity[]>(func, queryName);
    return response.map((i) => TransactionMapper.typeormToEntity(i));
  }

  async create(transaction: Transaction): Promise<void> {
    const queryName = 'CREATE_TRANSACTION';
    const queryRunner = this.dbClient.getDataSource().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const transactionEntity: TransactionEntity = TransactionMapper.entityToTypeOrm(transaction);
      const func = async () => queryRunner.manager.save(transactionEntity);
      await this.dbClient.executeQuery(func, queryName);
      await queryRunner.commitTransaction();
    } catch (e) {
      if (e instanceof Error) {
        const message = `An error ocurred while executing the query ${queryName}`;
        this.loggerService.error(message, e.message);
      }
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async updateStatus(id: string, status: number): Promise<void> {
    const queryName = 'UPDATE_TRANSACTION_STATUS';
    const queryRunner = this.dbClient.getDataSource().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const func = async () => queryRunner.manager.update(TransactionEntity, { externalId: id }, { status });
      await this.dbClient.executeQuery(func, queryName);
      await queryRunner.commitTransaction();
    } catch (e) {
      if (e instanceof Error) {
        const message = `An error ocurred while executing the query ${queryName}`;
        this.loggerService.error(message, e.message);
      }
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
