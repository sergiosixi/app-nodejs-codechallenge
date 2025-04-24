import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('identity')
  id: string;

  @Column()
  externalId?: string;

  @Column()
  sourceAccount: string;

  @Column()
  targetAccount: string;

  @Column()
  type: number;

  @Column()
  status: number;

  @Column()
  amount: number;

  @Column()
  createdAt: Date;
}
