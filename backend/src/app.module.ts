import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvestmentsModule } from './investments/investments.module';
import { UserIdMiddleware } from './middleware/user-id.middleware';
import { TransactionsModule } from './transactions/transactions.module';
import { StakingsModule } from './stakings/stakings.module';
import { CoingeckoModule } from './coingecko/coingecko.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/configuration';
import { StorageLocationsModule } from './storage-locations/storage-locations.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    InvestmentsModule,
    TransactionsModule,
    StakingsModule,
    CoingeckoModule,
    StorageLocationsModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdMiddleware).forRoutes('*');
  }
}
