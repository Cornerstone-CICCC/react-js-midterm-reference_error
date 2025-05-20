import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../../../prisma/prisma.service";
import { UserId } from "../../../user/domain/user.value-objects";
import { TransactionHistory } from "../../domain/transaction-history.entity";
import { EnumTransactionType } from "../../domain/transaction-history.value-objects";
import { TransactionHistoryRepository } from "../transaction-history.repository";

describe("TransactionHistoryRepository (Unit)", () => {
  let repository: TransactionHistoryRepository;
  let prismaService: PrismaService;

  // テスト用ユーザーID
  const testUserId = new UserId("user-123");

  // テスト用取引履歴データ
  const testPrismaTransactionHistories = [
    {
      id: "transaction-1",
      userId: "user-123",
      orderId: "order-123",
      type: EnumTransactionType.PURCHASE,
      createdAt: new Date("2023-01-01"),
    },
    {
      id: "transaction-2",
      userId: "user-123",
      orderId: "order-456",
      type: EnumTransactionType.SALE,
      createdAt: new Date("2023-01-02"),
    },
  ];

  // 新しい取引履歴エンティティ
  const newTransactionHistory = new TransactionHistory({
    userId: "user-123",
    orderId: "order-789",
    type: EnumTransactionType.PURCHASE,
    createdAt: new Date("2023-01-03"),
  });

  // 作成後の取引履歴データ
  const createdPrismaTransactionHistory = {
    id: "transaction-3",
    userId: "user-123",
    orderId: "order-789",
    type: EnumTransactionType.PURCHASE,
    createdAt: new Date("2023-01-03"),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionHistoryRepository,
        {
          provide: PrismaService,
          useValue: {
            transactionHistory: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<TransactionHistoryRepository>(TransactionHistoryRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("findByUser", () => {
    it("should return transaction histories for a user", async () => {
      // Prismaのモック設定
      jest
        .spyOn(prismaService.transactionHistory, "findMany")
        .mockResolvedValue(testPrismaTransactionHistories);

      // メソッド実行
      const result = await repository.findByUser(testUserId);

      // 検証
      expect(prismaService.transactionHistory.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-123",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // 結果の検証
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(TransactionHistory);
      expect(result[0].id?.getValue()).toBe("transaction-1");
      expect(result[0].userId.getValue()).toBe("user-123");
      expect(result[0].orderId.getValue()).toBe("order-123");
      expect(result[0].type).toBe(EnumTransactionType.PURCHASE);
      expect(result[0].createdAt).toEqual(new Date("2023-01-01"));

      expect(result[1]).toBeInstanceOf(TransactionHistory);
      expect(result[1].id?.getValue()).toBe("transaction-2");
      expect(result[1].type).toBe(EnumTransactionType.SALE);
    });

    it("should return empty array when user has no transaction histories", async () => {
      // Prismaのモック設定（空配列を返す）
      jest.spyOn(prismaService.transactionHistory, "findMany").mockResolvedValue([]);

      // メソッド実行
      const result = await repository.findByUser(testUserId);

      // 検証
      expect(prismaService.transactionHistory.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("save", () => {
    it("should save a new transaction history and return the created entity", async () => {
      // Prismaのモック設定
      jest
        .spyOn(prismaService.transactionHistory, "create")
        .mockResolvedValue(createdPrismaTransactionHistory);

      // hasIdメソッドのモック（IDを持っていないケース）
      jest.spyOn(newTransactionHistory, "hasId").mockReturnValue(false);

      // メソッド実行
      const result = await repository.save(newTransactionHistory);

      // 検証
      expect(prismaService.transactionHistory.create).toHaveBeenCalledWith({
        data: {
          userId: "user-123",
          orderId: "order-789",
          type: EnumTransactionType.PURCHASE,
          createdAt: new Date("2023-01-03"),
        },
      });

      // 結果の検証
      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(TransactionHistory);
      expect(result?.id?.getValue()).toBe("transaction-3");
      expect(result?.userId.getValue()).toBe("user-123");
      expect(result?.orderId.getValue()).toBe("order-789");
      expect(result?.type).toBe(EnumTransactionType.PURCHASE);
    });

    it("should return null when trying to save an entity that already has an ID", async () => {
      // 既存IDを持つエンティティの作成
      const existingTransactionHistory = new TransactionHistory({
        id: "existing-id",
        userId: "user-123",
        orderId: "order-123",
        type: EnumTransactionType.SALE,
        createdAt: new Date(),
      });

      // hasIdメソッドのモック（IDを持っているケース）
      jest.spyOn(existingTransactionHistory, "hasId").mockReturnValue(true);

      // メソッド実行
      const result = await repository.save(existingTransactionHistory);

      // 検証
      expect(prismaService.transactionHistory.create).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
