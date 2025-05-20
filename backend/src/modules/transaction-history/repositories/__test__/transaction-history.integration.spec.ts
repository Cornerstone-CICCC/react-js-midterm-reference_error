// import { Test, TestingModule } from "@nestjs/testing";
// import { User } from "../../../user/domain/user.entities";
// import { CreatePurchaseHistoryUseCase } from "../../application/usecases/create-purchase-history";
// import { CreateSaleHistoryUseCase } from "../../application/usecases/create-sale-history";
// import { GetUserTransactionHistoriesUseCase } from "../../application/usecases/get-user-transaction-histories";
// import { EnumTransactionType } from "../../domain/transaction-history.value-objects";
// import { TransactionHistoryDto } from "../../presentation/transaction-history.dto";
// import { TransactionHistoryResolver } from "../../presentation/transaction-history.resolver";

// describe("TransactionHistoryResolver (Integration)", () => {
//   let moduleRef: TestingModule;
//   let transactionHistoryResolver: TransactionHistoryResolver;
//   let getUserTransactionHistoriesUseCase: GetUserTransactionHistoriesUseCase;
//   let createPurchaseHistoryUseCase: CreatePurchaseHistoryUseCase;
//   let createSaleHistoryUseCase: CreateSaleHistoryUseCase;

//   // Sample transaction history data
//   const sampleTransactionHistoryDto: TransactionHistoryDto = {
//     id: "transaction-123",
//     userId: "user-456",
//     orderId: "order-789",
//     type: EnumTransactionType.PURCHASE,
//     createdAt: new Date(),
//   };

//   // Array of sample transaction histories
//   const sampleTransactionHistories: TransactionHistoryDto[] = [
//     {
//       id: "transaction-123",
//       userId: "user-456",
//       orderId: "order-789",
//       type: EnumTransactionType.PURCHASE,
//       createdAt: new Date(),
//     },
//     {
//       id: "transaction-124",
//       userId: "user-456",
//       orderId: "order-790",
//       type: EnumTransactionType.SALE,
//       createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
//     },
//   ];

//   // Sample user
//   const currentUser = new User({
//     id: "user-456",
//     authId: "auth-123",
//     email: "user@example.com",
//     nickname: "testuser",
//     avatarUrl: null,
//     bio: null,
//     isActive: true,
//   });

//   beforeEach(async () => {
//     moduleRef = await Test.createTestingModule({
//       providers: [
//         TransactionHistoryResolver,
//         {
//           provide: GetUserTransactionHistoriesUseCase,
//           useValue: {
//             execute: jest.fn(),
//           },
//         },
//         {
//           provide: CreatePurchaseHistoryUseCase,
//           useValue: {
//             execute: jest.fn(),
//           },
//         },
//         {
//           provide: CreateSaleHistoryUseCase,
//           useValue: {
//             execute: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     // Class instances
//     transactionHistoryResolver = moduleRef.get<TransactionHistoryResolver>(
//       TransactionHistoryResolver,
//     );
//     getUserTransactionHistoriesUseCase = moduleRef.get<GetUserTransactionHistoriesUseCase>(
//       GetUserTransactionHistoriesUseCase,
//     );
//     createPurchaseHistoryUseCase = moduleRef.get<CreatePurchaseHistoryUseCase>(
//       CreatePurchaseHistoryUseCase,
//     );
//     createSaleHistoryUseCase = moduleRef.get<CreateSaleHistoryUseCase>(CreateSaleHistoryUseCase);
//   });

//   // Test for getting user transaction histories
//   it("should get user transaction histories and return transaction history array", async () => {
//     // Set up mock for GetUserTransactionHistoriesUseCase
//     const getHistoriesSpy = jest
//       .spyOn(getUserTransactionHistoriesUseCase, "execute")
//       .mockResolvedValue(sampleTransactionHistories);

//     // Execute getUserTransactionHistories method
//     const result = await transactionHistoryResolver.getUserTransactionHistories(currentUser);

//     // Assertions
//     expect(getUserTransactionHistoriesUseCase.execute).toHaveBeenCalled();
//     expect(getHistoriesSpy).toHaveBeenCalledWith("user-456");
//     expect(result).toEqual(sampleTransactionHistories);
//     expect(result.length).toBe(2);
//   });

//   // Test for creating purchase history
//   it("should create purchase history and return transaction history", async () => {
//     // Set up mock for CreatePurchaseHistoryUseCase
//     const createPurchaseSpy = jest
//       .spyOn(createPurchaseHistoryUseCase, "execute")
//       .mockResolvedValue(sampleTransactionHistoryDto);

//     // Execute createPurchaseHistory method
//     const result = await transactionHistoryResolver.createPurchaseHistory(currentUser, "order-789");

//     // Assertions
//     expect(createPurchaseHistoryUseCase.execute).toHaveBeenCalled();
//     expect(createPurchaseSpy).toHaveBeenCalledWith("user-456", "order-789");
//     expect(result).toEqual(sampleTransactionHistoryDto);
//     expect(result.type).toBe(EnumTransactionType.PURCHASE);
//   });

//   // Test for creating sale history
//   it("should create sale history and return transaction history", async () => {
//     // Create a sample sale history DTO
//     const saleHistoryDto = {
//       ...sampleTransactionHistoryDto,
//       type: EnumTransactionType.SALE,
//     };

//     // Set up mock for CreateSaleHistoryUseCase
//     const createSaleSpy = jest
//       .spyOn(createSaleHistoryUseCase, "execute")
//       .mockResolvedValue(saleHistoryDto);

//     // Execute createSaleHistory method
//     const result = await transactionHistoryResolver.createSaleHistory(currentUser, "order-789");

//     // Assertions
//     expect(createSaleHistoryUseCase.execute).toHaveBeenCalled();
//     expect(createSaleSpy).toHaveBeenCalledWith("user-456", "order-789");
//     expect(result).toEqual(saleHistoryDto);
//     expect(result.type).toBe(EnumTransactionType.SALE);
//   });

//   // Test for getting user transaction histories when there are none
//   it("should return empty array when user has no transaction histories", async () => {
//     // Set up mock for GetUserTransactionHistoriesUseCase to return empty array
//     const getHistoriesSpy = jest
//       .spyOn(getUserTransactionHistoriesUseCase, "execute")
//       .mockResolvedValue([]);

//     // Execute getUserTransactionHistories method
//     const result = await transactionHistoryResolver.getUserTransactionHistories(currentUser);

//     // Assertions
//     expect(getUserTransactionHistoriesUseCase.execute).toHaveBeenCalled();
//     expect(getHistoriesSpy).toHaveBeenCalledWith("user-456");
//     expect(result).toEqual([]);
//     expect(result.length).toBe(0);
//   });
// });
