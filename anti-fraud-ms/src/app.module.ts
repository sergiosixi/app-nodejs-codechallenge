import { Module, Scope } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { FraudsModule } from './frauds/frauds.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from './shared/infrastructure/interceptors/error.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    FraudsModule,
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
