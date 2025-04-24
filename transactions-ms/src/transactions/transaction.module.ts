import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TransactionResolver } from './infrastructure/graphql/resolvers/transaction.resolver';
import { TypeOrmTransactionRepository } from './infrastructure/repositories/transactions/typeorm-transaction.repository';
import { TYPES } from './infrastructure/utils/types';
import { ConsumerController } from './infrastructure/kafka/consumer.controller';
import { CreateTransactionHandler } from './application/commands/handlers/create.handler';
import { UpdateStatusHandler } from './application/commands/handlers/update-status.handler';
import { GetAllHandler } from './application/queries/handlers/get-all.handler';

@Module({
  imports: [SharedModule],
  controllers: [ConsumerController],
  providers: [
    CreateTransactionHandler,
    UpdateStatusHandler,
    GetAllHandler,
    TransactionResolver,
    {
      provide: TYPES.TransactionRepository,
      useClass: TypeOrmTransactionRepository,
    },
  ],
})
export class TransactionModule {}
