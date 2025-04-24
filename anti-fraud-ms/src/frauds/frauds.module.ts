import { Module } from '@nestjs/common';
import { ConsumerController } from './infrastructure/kafka/consumer.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ValidateTransactionUseCase } from './application/usecases/validate-transaction.usecase';

@Module({
  imports: [SharedModule],
  controllers: [ConsumerController],
  providers: [ValidateTransactionUseCase],
})
export class FraudsModule {}
