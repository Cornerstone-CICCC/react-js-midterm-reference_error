import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TokenModule } from "./modules/auth/application/usecases/token.module";
import { AuthModule } from "./modules/auth/auth.module";
import { OrderModule } from "./modules/order/order.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { ProductModule } from "./modules/product/product.module";
import { TransactionHistoryModule } from "./modules/transaction-history/transaction-history.module";
import { UserModule } from "./modules/user/user.module";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // またはスキーマファイルのパス
      sortSchema: true,
    }),
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
    PaymentModule,
    TokenModule,
    TransactionHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
