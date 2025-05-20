import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { PaymentPrismaRepository } from "./payment.repository";
import { StripePaymentGatewayService } from "./stripe-payment-gateway.service";

@Module({
  providers: [
    PrismaService,
    PaymentPrismaRepository,
    StripePaymentGatewayService,
    {
      provide: "IPaymentRepository",
      useClass: PaymentPrismaRepository,
    },
    {
      provide: "IPaymentGateway",
      useClass: StripePaymentGatewayService,
    },
  ],
  exports: [
    PrismaService,
    PaymentPrismaRepository,
    StripePaymentGatewayService,
    "IPaymentGateway",
    "IPaymentRepository",
  ],
})
export class PaymentRepositoryModule {}
