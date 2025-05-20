// import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GetPaymentUseCase } from "../application/usecases/get-payment";
import { ProcessPaymentUseCase } from "../application/usecases/process-payment";
import { PaymentResponseDto, ProcessPaymentInput } from "./payment.dto";
// import { AuthGuard } from "../../../../shared/auth/guards/auth.guard";

@Resolver(() => PaymentResponseDto)
export class PaymentResolver {
  constructor(
    private readonly getPaymentCase: GetPaymentUseCase,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
  ) {}

  @Mutation(() => PaymentResponseDto)
  //   @UseGuards(AuthGuard)
  async processPayment(@Args("input") input: ProcessPaymentInput): Promise<PaymentResponseDto> {
    const payment = await this.processPaymentUseCase.execute({
      orderId: input.orderId,
      amount: input.amount,
      method: input.method,
    });

    return payment;
  }

  @Query(() => PaymentResponseDto, { nullable: true })
  //   @UseGuards(AuthGuard)
  async getPaymentByOrderId(
    @Args("orderId", { type: () => ID }) orderId: string,
  ): Promise<PaymentResponseDto | null> {
    const payment = await this.getPaymentCase.executeByOrderId(orderId);

    if (!payment) return null;

    return payment;
  }
}
