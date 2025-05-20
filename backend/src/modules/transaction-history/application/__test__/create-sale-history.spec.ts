// import { Test } from "@nestjs/testing";
// import { PrismaService } from "../../../../prisma/prisma.service";
// import { TransactionHistory } from "../../domain/transaction-history.entity";
// import { EnumTransactionType } from "../../domain/transaction-history.value-objects";
// import { CreateSaleHistoryUseCase } from "../usecases/create-sale-history";

// describe("CreateSaleHistoryUseCase", () => {
//   let useCase: CreateSaleHistoryUseCase;
//   let prismaService: jest.Mocked<PrismaService>;
//   const fixedDate = new Date("2025-05-15T00:00:00.000Z");

//   jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

//   beforeEach(async () => {
//     // PrismaServiceのモック作成
//     const prismaServiceMock = {
//       transactionHistory: {
//         create: jest.fn(),
//       },
//     };

//     // テストモジュールのセットアップ
//     const moduleRef = await Test.createTestingModule({
//       providers: [
//         CreateSaleHistoryUseCase,
//         {
//           provide: PrismaService,
//           useValue: prismaServiceMock,
//         },
//       ],
//     }).compile();

//     // ユースケースとPrismaServiceの取得
//     useCase = moduleRef.get<CreateSaleHistoryUseCase>(CreateSaleHistoryUseCase);
//     prismaService = moduleRef.get(PrismaService) as jest.Mocked<PrismaService>;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   afterAll(() => {
//     jest.restoreAllMocks();
//   });

//   it("should successfully create a sale history", async () => {
//     // テスト用のデータ
//     const userId = "user-123";
//     const orderId = "order-123";
//     const historyId = "history-123";

//     // createSaleHistoryメソッドのスパイ
//     const createSaleHistorySpy = jest.spyOn(TransactionHistory.prototype, "createSaleHistory");

//     // Prismaのレスポンスをモック
//     prismaService.transactionHistory.create.mockResolvedValue({
//       id: historyId,
//       userId: userId,
//       orderId: orderId,
//       type: EnumTransactionType.SALE,
//       createdAt: fixedDate,
//     });

//     // ユースケースを実行
//     const result = await useCase.execute(userId, orderId);

//     // アサーション
//     // 1. createSaleHistoryメソッドが呼ばれたか
//     expect(createSaleHistorySpy).toHaveBeenCalled();

//     // 2. Prismaのcreateメソッドが正しいパラメータで呼ばれたか
//     expect(prismaService.transactionHistory.create).toHaveBeenCalledWith(
//       expect.objectContaining({
//         data: expect.objectContaining({
//           userId: expect.any(String),
//           orderId: expect.any(String),
//           type: EnumTransactionType.SALE,
//         }),
//       }),
//     );

//     // 3. 結果が正しいか
//     expect(result).toEqual(
//       expect.objectContaining({
//         userId,
//         orderId,
//         type: EnumTransactionType.SALE,
//       }),
//     );
//   });

//   it("should throw error when database operation fails", async () => {
//     // テスト用のデータ
//     const userId = "user-456";
//     const orderId = "order-456";

//     // データベース接続エラーをシミュレート
//     const dbError = new Error("Database connection error");
//     prismaService.transactionHistory.create.mockRejectedValue(dbError);

//     // ユースケースを実行し、エラーが投げられることを確認
//     await expect(useCase.execute(userId, orderId)).rejects.toThrow();

//     // Prismaのcreateメソッドが呼ばれたことを確認
//     expect(prismaService.transactionHistory.create).toHaveBeenCalled();
//   });

//   it("should handle invalid input data", async () => {
//     // 無効なユーザーIDとオーダーID
//     const invalidUserId = "";
//     const orderId = "order-789";

//     // 無効な入力に対するエラーをシミュレート
//     // ユースケースが無効な入力に対してエラーを投げることを想定
//     await expect(useCase.execute(invalidUserId, orderId)).rejects.toThrow();

//     // Prismaのcreateメソッドが呼ばれなかったことを確認
//     expect(prismaService.transactionHistory.create).not.toHaveBeenCalled();
//   });
// });
