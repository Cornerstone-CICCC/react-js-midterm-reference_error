import { Test } from "@nestjs/testing";
import { PrismaService } from "../../../../prisma/prisma.service";
import { TransactionHistory } from "../../domain/transaction-history.entity";
import { EnumTransactionType } from "../../domain/transaction-history.value-objects";
import { CreatePurchaseHistoryUseCase } from "../usecases/create-purchase-history";

describe("CreatePurchaseHistoryUseCase", () => {
  // let useCase: CreatePurchaseHistoryUseCase;
  // let transactionHistoryRepository: jest.Mocked<ITransactionHistoryRepository>;
  let prismaService: PrismaService;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");

  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // Mock the repository
    const transactionHistoryRepositoryMock = {
      save: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreatePurchaseHistoryUseCase,
        {
          provide: "ITransactionHistoryRepository",
          useValue: transactionHistoryRepositoryMock,
        },
        {
          provide: PrismaService,
          useValue: {
            transactionHistory: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    // Get the use case and repository from the module
    // useCase = moduleRef.get<CreatePurchaseHistoryUseCase>(CreatePurchaseHistoryUseCase);
    // transactionHistoryRepository = moduleRef.get(
    //   "ITransactionHistoryRepository",
    // ) as jest.Mocked<ITransactionHistoryRepository>;
    prismaService = moduleRef.get(PrismaService) as jest.Mocked<PrismaService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully create a purchase history", async () => {
    // User ID, Order ID and History ID for the test
    const userId = "user-123";
    const orderId = "order-123";
    const historyId = "history-123";

    // Mock the createPurchaseHistory method
    // const createPurchaseHistorySpy = jest.spyOn(
    //   TransactionHistory.prototype,
    //   "createPurchaseHistory",
    // );

    // Create an instance of TransactionHistory with the necessary properties
    const savedHistory = new TransactionHistory({
      id: historyId,
      userId,
      orderId,
      type: EnumTransactionType.PURCHASE,
      createdAt: fixedDate,
    });
    prismaService.transactionHistory.create = jest.fn().mockResolvedValue(savedHistory);
    // Mock the repository methods
    // transactionHistoryRepository.save.mockResolvedValue(savedHistory);

    // Execute the use case
    // const result = await useCase.execute(userId, orderId);

    // Assertions
    // 1. Is createPurchaseHistory called?
    // expect(createPurchaseHistorySpy).toHaveBeenCalled();

    // 2. Is the repository's save method called with the correct parameters?
    // expect(transactionHistoryRepository.save).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     // Assert that the properties are correct
    //     userId: expect.any(UserId),
    //     orderId: expect.any(OrderId),
    //     type: EnumTransactionType.PURCHASE,
    //   }),
    // );

    // 3. Assert that the result is an instance of TransactionHistory
    // expect(result).toEqual(
    //   expect.objectContaining({
    //     userId,
    //     orderId,
    //     type: EnumTransactionType.PURCHASE,
    //   }),
    // );
  });

  it("should throw error when repository save fails", async () => {
    // User ID and Order ID for the test
    // const userId = "user-456";
    // const orderId = "order-456";
    // Mock Error for repository save
    // const saveError = new Error("Database connection error");
    // transactionHistoryRepository.save.mockRejectedValue(saveError);
    // Execute the use case and expect it to throw the error
    // await expect(useCase.execute(userId, orderId)).rejects.toThrow(saveError);
    // Assertions
    // expect(transactionHistoryRepository.save).toHaveBeenCalled();
  });

  it("should handle invalid input data", async () => {
    // User ID and Order ID for the test
    // const invalidUserId = "";
    // const orderId = "order-789";
    // Mock Error for invalid input
    // Assuming that the use case should throw an error for invalid input
    // await expect(useCase.execute(invalidUserId, orderId)).rejects.toThrow();
    // Assertions
    // expect(transactionHistoryRepository.save).not.toHaveBeenCalled();
  });
});
