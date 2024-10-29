import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvestmentsModule } from './investments/investments.module';
import { UserIdMiddleware } from './middleware/user-id.middleware';
import { TransactionsModule } from './transactions/transactions.module';
import { StakingsModule } from './stakings/stakings.module';

@Module({
  imports: [InvestmentsModule, TransactionsModule, StakingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdMiddleware).forRoutes('*');
  }
}
