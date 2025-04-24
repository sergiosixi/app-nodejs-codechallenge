import { TransactionType } from 'src/transactions/domain/enums/transaction-type.enum';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { Transaction as TransactionEntity } from './transaction.entity';
import { TransactionStatus } from 'src/transactions/domain/enums/transaction-status.enum';

export class TransactionMapper {
  public static entityToTypeOrm(transaction: Transaction): TransactionEntity {
    const transactionEntity = new TransactionEntity();
    transactionEntity.externalId = transaction.getExternalId();
    transactionEntity.sourceAccount = transaction.getSourceAccount();
    transactionEntity.targetAccount = transaction.getTargetAccount();
    transactionEntity.type = transaction.getType().getId();
    transactionEntity.status = transaction.getStatus().getId();
    transactionEntity.amount = transaction.getAmount();
    transactionEntity.createdAt = new Date();
    return transactionEntity;
  }

  public static typeormToEntity(transactionEntity: TransactionEntity): Transaction {
    const transaction = new Transaction({
      transactionExternalId: transactionEntity.externalId,
      sourceAccount: transactionEntity.sourceAccount,
      targetAccount: transactionEntity.targetAccount,
      transactionType: {
        id: transactionEntity.type,
        name: TransactionType[transactionEntity.type].toLowerCase(),
      },
      transactionStatus: {
        id: transactionEntity.status,
        name: TransactionStatus[transactionEntity.status].toLowerCase(),
      },
      value: transactionEntity.amount,
      createdAt: transactionEntity.createdAt,
    });
    return transaction;
  }
}
