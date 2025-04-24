export interface TransactionDto {
  transactionExternalId?: string;
  sourceAccount?: string;
  targetAccount?: string;
  transactionType: TransactionTypeDto;
  transactionStatus?: TransactionStatusDto;
  value: number;
  createdAt: Date;
}

export interface TransactionTypeDto {
  id?: number;
  name?: string;
}

export interface TransactionStatusDto {
  id?: number;
  name?: string;
}
