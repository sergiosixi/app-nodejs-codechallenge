import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TransactionType } from './transaction-type.entity';
import { TransactionStatus } from './transaction-status.entity';

@ObjectType()
export class Transaction {
  @Field()
  externalId: string;

  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Field(() => Int)
  value: number;

  @Field(() => Date)
  createdAt: Date;
}
