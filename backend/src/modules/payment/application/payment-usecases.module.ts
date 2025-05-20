import { Module } from "@nestjs/common";
import { PaymentRepositoryModule } from "../repositories/payment.repository.module";
import { StripePaymentGatewayService } from "../repositories/stripe-payment-gateway.service";
import { GetPaymentUseCase } from "./usecases/get-payment";
import { ProcessPaymentUseCase } from "./usecases/process-payment";

@Module({
  imports: [PaymentRepositoryModule],
  providers: [GetPaymentUseCase, ProcessPaymentUseCase, StripePaymentGatewayService],
  exports: [GetPaymentUseCase, ProcessPaymentUseCase],
})
export class PaymentUseCasesModule {}
