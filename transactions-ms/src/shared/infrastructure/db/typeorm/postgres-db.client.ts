import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Transaction } from 'src/transactions/infrastructure/repositories/transactions/transaction.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class PostgresDbClient {
  private readonly datasource: DataSource;

  constructor() {
    this.datasource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Transaction],
      useUTC: true,
      logging: false,
      dropSchema: false,
      synchronize: true,
    });
  }

  public async init() {
    await this.datasource.initialize();
    console.log('Conectado a base de datos');
  }

  public getDataSource(): DataSource {
    return this.datasource;
  }

  public async executeQuery<T>(func: () => Promise<T>, queryName: string): Promise<T> {
    try {
      const response = await func();
      return response;
    } catch (e) {
      if (e instanceof Error) {
        const message = `Error executing the query ${queryName}: ${e.message}`;
        throw new BadGatewayException(message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
