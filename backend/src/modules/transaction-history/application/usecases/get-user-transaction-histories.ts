import { Inject, Injectable } from "@nestjs/common";
import { UserId } from "../../../user/domain/user.value-objects";
import {
  TransactionHistoryDto,
  mapToHistoryPrimitive,
} from "../../presentation/transaction-history.dto";
import { ITransactionHistoryRepository } from "../../repositories/transaction-history.repository.interface";

@Injectable()
export class GetUserTransactionHistoriesUseCase {
  constructor(
    @Inject("ITransactionHistoryRepository")
    private readonly transactionHistoryRepository: ITransactionHistoryRepository,
  ) {}

  async execute(userId: string): Promise<TransactionHistoryDto[]> {
    const userIdVO = new UserId(userId);

    const transactionHistories = await this.transactionHistoryRepository.findByUser(userIdVO);

    // TODO: 次のバージョンで、productIdやorderIdを使って、商品情報や注文情報を取得する必要がある。
    return transactionHistories.map((history) => mapToHistoryPrimitive(history));
  }
}
