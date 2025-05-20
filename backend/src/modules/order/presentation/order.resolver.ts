import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "../../auth/presentation/current-user.decorators";
import { CompleteOrderUseCase } from "../application/usecases/complete-order";
import { CreateOrderUseCase } from "../application/usecases/create-order";
import { GetOrderUseCase } from "../application/usecases/get-order";
import { PurchaseProductService } from "../application/usecases/purchase-product";
import { CreateOrderInput, OrderResponse, PurchaseProductInput } from "./order.dtos";
// import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
@Resolver("User")
export class OrderResolver {
  constructor(
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly completeOrderUseCase: CompleteOrderUseCase,
    private readonly orderService: PurchaseProductService,
  ) {}

  @Mutation(() => OrderResponse)
  //   @UseGuards(AuthGuard)
  async purchaseProduct(
    @Args("input") input: PurchaseProductInput,
    @CurrentUser() userId: string,
  ): Promise<OrderResponse> {
    // 1. Validate input
    // if (!user.id) {
    //   throw new Error("User ID is required");
    // }

    const effectiveUserId =
      process.env.NODE_ENV === "test" ? userId : "e75e9165-2b6b-4d33-adbd-2eb5aac39ea5";

    const order = await this.orderService.purchaseProduct(
      input.productId,
      effectiveUserId,
      input.paymentMethod,
    );

    return order;
  }

  @Query(() => OrderResponse)
  //   @UseGuards(JwtAuthGuard)
  async getOrderById(
    @CurrentUser() userId: string,
    @Args("id") id: string,
  ): Promise<OrderResponse> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return await this.getOrderUseCase.execute(userId, id);
  }

  @Mutation(() => OrderResponse)
  //   @UseGuards(JwtAuthGuard)
  async createOrder(
    @CurrentUser() userId: string,
    @Args("input") input: CreateOrderInput,
  ): Promise<OrderResponse> {
    // if (!currentUser.id) {
    //   throw new Error("User ID is required");
    // }
    const effectiveUserId =
      process.env.NODE_ENV === "test" ? userId : "e75e9165-2b6b-4d33-adbd-2eb5aac39ea5";

    const updatedUser = await this.createOrderUseCase.execute(effectiveUserId, input.productId);

    return updatedUser;
  }

  @Mutation(() => OrderResponse)
  //   @UseGuards(JwtAuthGuard)
  async completeOrder(@Args("id") id: string): Promise<OrderResponse> {
    return this.completeOrderUseCase.execute(id);
  }
}
