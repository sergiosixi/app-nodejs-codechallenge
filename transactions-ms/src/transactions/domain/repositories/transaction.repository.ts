import { Transaction } from '../entities/transaction.entity';

export interface TransactionRepository {
  getAll(): Promise<Transaction[]>;
  create(transaction: Transaction): Promise<void>;
  updateStatus(id: string, status: number): Promise<void>;
}
