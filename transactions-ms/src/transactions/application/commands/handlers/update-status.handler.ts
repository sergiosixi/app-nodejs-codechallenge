import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoggerService } from 'src/shared/infrastructure/services/logger/logger.service';
import { TYPES as SHARED_TYPES } from 'src/shared/infrastructure/utils/types';
import { TransactionRepository } from 'src/transactions/domain/repositories/transaction.repository';
import { TYPES } from 'src/transactions/infrastructure/utils/types';
import { UpdateStatusCommand } from '../update-status.command';

@Injectable()
@CommandHandler(UpdateStatusCommand)
export class UpdateStatusHandler implements ICommandHandler<UpdateStatusCommand> {
  constructor(
    @Inject(TYPES.TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    @Inject(SHARED_TYPES.LoggerService)
    private readonly loggerService: LoggerService,
  ) {}

  async execute(command: UpdateStatusCommand): Promise<boolean> {
    const { id, status } = command;

    try {
      await this.transactionRepository.updateStatus(id, status);
      return true;
    } catch (e) {
      if (e instanceof Error) {
        this.loggerService.error(e.message);
      }
      return false;
    }
  }
}
