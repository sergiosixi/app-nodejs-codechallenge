import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { SharedModule } from './shared/shared.module';
import { TransactionModule } from './transactions/transaction.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from './shared/infrastructure/interceptors/error.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), '/src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    CqrsModule.forRoot(),
    SharedModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule {}
