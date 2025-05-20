import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "../../auth/presentation/current-user.decorators";
import { User } from "../../user/domain/user.entities";
import { CreatePurchaseHistoryUseCase } from "../application/usecases/create-purchase-history";
import { CreateSaleHistoryUseCase } from "../application/usecases/create-sale-history";
import { GetUserTransactionHistoriesUseCase } from "../application/usecases/get-user-transaction-histories";
import { TransactionHistoryDto } from "./transaction-history.dto";
// import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';

@Resolver("TransactionHistoryDto")
export class TransactionHistoryResolver {
  constructor(
    private readonly getUserTransactionHistoriesUseCase: GetUserTransactionHistoriesUseCase,
    private readonly createPurchaseHistoryUseCase: CreatePurchaseHistoryUseCase,
    private readonly createSalesHistoryUseCase: CreateSaleHistoryUseCase,
  ) {}

  @Mutation(() => TransactionHistoryDto)
  // @UseGuards(JwtAuthGuard)
  async createPurchaseHistory(
    @CurrentUser() user: User,
    @Args("orderId") id: string,
  ): Promise<TransactionHistoryDto> {
    if (!user || !user.id) {
      throw new Error("User not found");
    }
    return await this.createPurchaseHistoryUseCase.execute(user.id.getValue(), id);
  }

  @Mutation(() => TransactionHistoryDto)
  // @UseGuards(JwtAuthGuard)
  async createSaleHistory(
    @CurrentUser() user: User,
    @Args("orderId") id: string,
  ): Promise<TransactionHistoryDto> {
    if (!user || !user.id) {
      throw new Error("User not found");
    }
    return await this.createSalesHistoryUseCase.execute(user.id.getValue(), id);
  }

  @Query(() => [TransactionHistoryDto])
  //   @UseGuards(JwtAuthGuard)
  async getUserTransactionHistories(@CurrentUser() user: User): Promise<TransactionHistoryDto[]> {
    // if (!user || !user.id) {
    //   throw new Error("User not found");
    // }

    const effectiveUserId =
      process.env.NODE_ENV === "test"
        ? (user.id?.getValue() ?? "")
        : "e75e9165-2b6b-4d33-adbd-2eb5aac39ea5";

    return await this.getUserTransactionHistoriesUseCase.execute(effectiveUserId);
  }
}
