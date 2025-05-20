// モックするPrismaオブジェクトとその型
const mockPrismaOrder = {
  findUnique: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock("../../../../prisma/prisma.service", () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => {
      return {
        order: mockPrismaOrder,
      };
    }),
  };
});

import * as path from "node:path";
import * as dotenv from "dotenv";

const envPath = path.resolve(__dirname, "../../../.env.test");
dotenv.config({ path: envPath });

import { Test } from "@nestjs/testing";
import { PrismaService } from "../../../../prisma/prisma.service";
import { Order } from "../../domain/order.entity";
import { EnumOrderStatus, OrderId } from "../../domain/order.value-objects";
import { OrderRepository } from "../order.repository";

describe("OrderRepository", () => {
  let repository: OrderRepository;

  beforeEach(async () => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [OrderRepository, PrismaService],
    }).compile();

    repository = moduleRef.get<OrderRepository>(OrderRepository);
  });

  // テスト用のデータを作成
  const mockOrderData = {
    id: "order-123",
    productId: "product-456",
    buyerId: "buyer-789",
    sellerId: "seller-012",
    finalPrice: 100,
    status: EnumOrderStatus.CREATED,
    createdAt: new Date(),
    paidAt: null,
    completedAt: null,
  };

  describe("findById", () => {
    it("should return an order by id", async () => {
      // モックの戻り値を設定
      mockPrismaOrder.findUnique.mockResolvedValue(mockOrderData);

      // OrderIdを作成
      const orderId = new OrderId("order-123");

      // メソッドを実行
      const result = await repository.findById(orderId);

      // 検証
      expect(mockPrismaOrder.findUnique).toHaveBeenCalledWith({
        where: { id: "order-123" },
      });
      expect(result).toBeInstanceOf(Order);
      expect(result?.id?.getValue()).toBe("order-123");
      expect(result?.status).toBe(EnumOrderStatus.CREATED);
    });

    it("should return null when order is not found", async () => {
      // モックの戻り値を設定
      mockPrismaOrder.findUnique.mockResolvedValue(null);

      // OrderIdを作成
      const orderId = new OrderId("nonexistent-order");

      // メソッドを実行
      const result = await repository.findById(orderId);

      // 検証
      expect(result).toBeNull();
    });
  });

  describe("findByUserId", () => {
    it("should return orders for a user as buyer or seller", async () => {
      // モックの戻り値を設定
      mockPrismaOrder.findMany.mockResolvedValue([mockOrderData]);

      // ユーザーID
      const userId = "buyer-789";

      // メソッドを実行
      const result = await repository.findByUserId(userId);

      // 検証
      expect(mockPrismaOrder.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ buyerId: userId }, { sellerId: userId }],
        },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Order);
      expect(result[0]?.buyerId?.getValue()).toBe("buyer-789");
    });

    it("should return empty array when no orders are found", async () => {
      // モックの戻り値を設定
      mockPrismaOrder.findMany.mockResolvedValue([]);

      // ユーザーID
      const userId = "nonexistent-user";

      // メソッドを実行
      const result = await repository.findByUserId(userId);

      // 検証
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
  });

  describe("save", () => {
    it("should create a new order", async () => {
      // モックの戻り値を設定
      mockPrismaOrder.create.mockResolvedValue(mockOrderData);

      // 新しい注文を作成
      const newOrder = new Order({
        productId: "product-456",
        buyerId: "buyer-789",
        sellerId: "seller-012",
        finalPrice: 100,
        status: EnumOrderStatus.CREATED,
      });

      // メソッドを実行
      const result = await repository.save(newOrder);

      // 検証
      expect(mockPrismaOrder.create).toHaveBeenCalledWith({
        data: {
          productId: expect.any(String),
          buyerId: "buyer-789",
          sellerId: "seller-012",
          finalPrice: 100,
          status: EnumOrderStatus.CREATED,
          createdAt: expect.any(Date),
          paidAt: undefined,
          completedAt: undefined,
        },
      });
      expect(result).toBeInstanceOf(Order);
      expect(result?.id?.getValue()).toBe("order-123"); // モックの返り値から
    });

    it("should return null when trying to save an order with existing id", async () => {
      // 既存IDを持つ注文を作成
      const existingOrder = new Order({
        id: "existing-order",
        productId: "product-456",
        buyerId: "buyer-789",
        sellerId: "seller-012",
        finalPrice: 100,
        status: EnumOrderStatus.CREATED,
      });

      // spyOnを使って、hasId()が真を返すように設定
      jest.spyOn(existingOrder, "hasId").mockReturnValue(true);

      // メソッドを実行
      const result = await repository.save(existingOrder);

      // 検証
      expect(mockPrismaOrder.create).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update an existing order", async () => {
      // モックの戻り値を設定
      mockPrismaOrder.update.mockResolvedValue({
        ...mockOrderData,
        status: "PAID",
        paidAt: new Date(),
      });

      // 更新する注文を作成
      const updatedOrder = new Order({
        id: "order-123",
        productId: "product-456",
        buyerId: "buyer-789",
        sellerId: "seller-012",
        finalPrice: 100,
        status: EnumOrderStatus.PAID,
        createdAt: new Date(),
        paidAt: new Date(),
      });

      // spyOnを使って、hasId()が真を返すように設定
      jest.spyOn(updatedOrder, "hasId").mockReturnValue(true);

      // メソッドを実行
      await repository.update(updatedOrder);

      // 検証
      expect(mockPrismaOrder.update).toHaveBeenCalledWith({
        where: { id: "order-123" },
        data: {
          status: EnumOrderStatus.PAID,
          paidAt: expect.any(Date),
          completedAt: undefined,
        },
      });
    });

    it("should not update when order has no id", async () => {
      // IDなしの注文を作成
      const orderWithoutId = new Order({
        productId: "product-456",
        buyerId: "buyer-789",
        sellerId: "seller-012",
        finalPrice: 100,
        status: EnumOrderStatus.CREATED,
      });

      // spyOnを使って、hasId()が偽を返すように設定
      jest.spyOn(orderWithoutId, "hasId").mockReturnValue(false);

      // メソッドを実行
      await repository.update(orderWithoutId);

      // 検証
      expect(mockPrismaOrder.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete an order by id", async () => {
      // モックの戻り値を設定
      mockPrismaOrder.delete.mockResolvedValue(mockOrderData);

      // OrderIdを作成
      const orderId = new OrderId("order-123");

      // メソッドを実行
      await repository.delete(orderId);

      // 検証
      expect(mockPrismaOrder.delete).toHaveBeenCalledWith({
        where: { id: "order-123" },
      });
    });
  });
});
