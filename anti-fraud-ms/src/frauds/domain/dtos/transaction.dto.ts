export interface TransactionDto {
  transactionExternalId?: string;
  sourceAccount?: string;
  targetAccount?: string;
  transactionType: TransactionTypeDto;
  value: number;
}

export interface TransactionTypeDto {
  id?: number;
  name?: string;
}
