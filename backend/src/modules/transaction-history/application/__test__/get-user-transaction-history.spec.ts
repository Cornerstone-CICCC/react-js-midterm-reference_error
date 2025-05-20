// import { Test } from "@nestjs/testing";
// import { UserId } from "../../../user/domain/user.value-objects";
// import { TransactionHistory } from "../../domain/transaction-history.entity";
// import { EnumTransactionType } from "../../domain/transaction-history.value-objects";
// import { ITransactionHistoryRepository } from "../../repositories/transaction-history.repository.interface";
// import { GetUserTransactionHistoriesUseCase } from "../usecases/get-user-transaction-histories";

// describe("GetUserTransactionHistoriesUseCase", () => {
//   let useCase: GetUserTransactionHistoriesUseCase;
//   let transactionHistoryRepository: jest.Mocked<ITransactionHistoryRepository>;
//   const fixedDate = new Date("2025-05-15T00:00:00.000Z");

//   jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

//   beforeEach(async () => {
//     // Mock the repository
//     const transactionHistoryRepositoryMock = {
//       findByUser: jest.fn(),
//     };

//     // Set up the testing module
//     const moduleRef = await Test.createTestingModule({
//       providers: [
//         GetUserTransactionHistoriesUseCase,
//         {
//           provide: "ITransactionHistoryRepository",
//           useValue: transactionHistoryRepositoryMock,
//         },
//       ],
//     }).compile();

//     // Get the use case and repository from the module
//     useCase = moduleRef.get<GetUserTransactionHistoriesUseCase>(GetUserTransactionHistoriesUseCase);
//     transactionHistoryRepository = moduleRef.get(
//       "ITransactionHistoryRepository",
//     ) as jest.Mocked<ITransactionHistoryRepository>;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   afterAll(() => {
//     jest.restoreAllMocks();
//   });

//   it("should successfully get user transaction histories", async () => {
//     // Data for the test
//     const userId = "user-123";
//     const orderId1 = "order-123";
//     const orderId2 = "order-456";
//     const historyId1 = "history-123";
//     const historyId2 = "history-456";

//     // Create instances of TransactionHistory
//     const transactionHistories = [
//       new TransactionHistory({
//         id: historyId1,
//         userId,
//         orderId: orderId1,
//         type: EnumTransactionType.PURCHASE,
//         createdAt: fixedDate,
//       }),
//       new TransactionHistory({
//         id: historyId2,
//         userId,
//         orderId: orderId2,
//         type: EnumTransactionType.SALE,
//         createdAt: new Date(fixedDate.getTime() - 86400000), // 1日前
//       }),
//     ];

//     // Mock the repository method to return the test data
//     transactionHistoryRepository.findByUser.mockResolvedValue(transactionHistories);

//     // Execute the use case
//     const result = await useCase.execute(userId);

//     // Assertions
//     // 1. Is findByUser called with the correct UserId?
//     expect(transactionHistoryRepository.findByUser).toHaveBeenCalledWith(expect.any(UserId));
//     const calledUserId = transactionHistoryRepository.findByUser.mock.calls[0][0];
//     expect(calledUserId.getValue()).toBe(userId);

//     // 2. Assert that the result is an array of TransactionHistory
//     expect(result).toHaveLength(2);
//     expect(result[0]).toEqual(
//       expect.objectContaining({
//         userId,
//         orderId: orderId1,
//         type: EnumTransactionType.PURCHASE,
//       }),
//     );
//     expect(result[1]).toEqual(
//       expect.objectContaining({
//         userId,
//         orderId: orderId2,
//         type: EnumTransactionType.SALE,
//       }),
//     );
//   });

//   it("should return empty array when user has no transaction histories", async () => {
//     // User ID for the test
//     const userId = "user-without-history";

//     // Simulate the repository returning an empty array
//     transactionHistoryRepository.findByUser.mockResolvedValue([]);

//     // Execute the use case
//     const result = await useCase.execute(userId);

//     // Assertions
//     expect(transactionHistoryRepository.findByUser).toHaveBeenCalledWith(expect.any(UserId));
//     expect(result).toHaveLength(0);
//     expect(result).toEqual([]);
//   });

//   it("should throw error for invalid user ID", async () => {
//     // Invalid User ID for the test
//     const invalidUserId = "";

//     // Execute the use case and expect it to throw an error
//     await expect(useCase.execute(invalidUserId)).rejects.toThrow();

//     // Assertions
//     // Check that the repository method was not called
//     expect(transactionHistoryRepository.findByUser).not.toHaveBeenCalled();
//   });

//   it("should handle repository errors", async () => {
//     // User ID for the test
//     const userId = "user-123";

//     // Simulate a database connection error
//     const repositoryError = new Error("Database connection error");
//     transactionHistoryRepository.findByUser.mockRejectedValue(repositoryError);

//     // Execute the use case and expect it to throw the error
//     await expect(useCase.execute(userId)).rejects.toThrow(repositoryError);

//     // Assertions
//     expect(transactionHistoryRepository.findByUser).toHaveBeenCalledWith(expect.any(UserId));
//   });
// });
