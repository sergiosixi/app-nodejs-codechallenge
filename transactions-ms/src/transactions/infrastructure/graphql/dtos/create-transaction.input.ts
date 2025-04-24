import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @Field(() => Int)
  @IsNumber()
  tranferTypeId: number;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  value: number;
}
