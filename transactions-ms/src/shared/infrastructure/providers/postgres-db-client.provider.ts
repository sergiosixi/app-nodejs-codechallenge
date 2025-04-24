import { Provider } from '@nestjs/common';
import { PostgresDbClient } from '../db/typeorm/postgres-db.client';

export const PostgresDbClientProvider: Provider = {
  provide: PostgresDbClient,
  useFactory: async () => {
    const dbClient = new PostgresDbClient();
    await dbClient.init();
    return dbClient;
  },
};
