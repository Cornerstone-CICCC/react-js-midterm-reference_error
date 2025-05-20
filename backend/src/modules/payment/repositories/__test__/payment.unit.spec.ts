// モックするPrismaオブジェクトとその型
const mockPrismaPayment = {
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

jest.mock("../../../../prisma/prisma.service", () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => {
      return {
        payment: mockPrismaPayment,
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
import { OrderId } from "../../../order/domain/order.value-objects";
import { Payment } from "../../domain/payment.entity";
import { EnumPaymentMethod, EnumPaymentStatus, PaymentId } from "../../domain/payment.value-object";
import { PaymentPrismaRepository } from "../payment.repository";

describe("PaymentPrismaRepository", () => {
  let repository: PaymentPrismaRepository;

  beforeEach(async () => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [PaymentPrismaRepository, PrismaService],
    }).compile();

    repository = moduleRef.get<PaymentPrismaRepository>(PaymentPrismaRepository);
  });

  // テスト用のデータを作成
  const mockPaymentData = {
    id: "payment-123",
    orderId: "order-456",
    amount: 100,
    fee: 5,
    method: EnumPaymentMethod.CREDIT_CARD,
    status: EnumPaymentStatus.PENDING,
    createdAt: new Date(),
    processedAt: null,
  };

  describe("findById", () => {
    it("should return a payment by id", async () => {
      // モックの戻り値を設定
      mockPrismaPayment.findUnique.mockResolvedValue(mockPaymentData);

      // PaymentIdを作成
      const paymentId = new PaymentId("payment-123");

      // メソッドを実行
      const result = await repository.findById(paymentId);

      // 検証
      expect(mockPrismaPayment.findUnique).toHaveBeenCalledWith({
        where: { id: "payment-123" },
      });
      expect(result).toBeInstanceOf(Payment);
      expect(result?.id?.getValue()).toBe("payment-123");
      expect(result?.status).toBe(EnumPaymentStatus.PENDING);
      expect(result?.method).toBe(EnumPaymentMethod.CREDIT_CARD);
      expect(result?.amount.getAmount()).toBe(100);
      expect(result?.fee.getAmount()).toBe(5);
    });

    it("should return null when payment is not found", async () => {
      // モックの戻り値を設定
      mockPrismaPayment.findUnique.mockResolvedValue(null);

      // PaymentIdを作成
      const paymentId = new PaymentId("nonexistent-payment");

      // メソッドを実行
      const result = await repository.findById(paymentId);

      // 検証
      expect(result).toBeNull();
    });
  });

  describe("findByOrderId", () => {
    it("should return a payment by order id", async () => {
      // モックの戻り値を設定
      mockPrismaPayment.findUnique.mockResolvedValue(mockPaymentData);

      // OrderIdを作成
      const orderId = new OrderId("order-456");

      // メソッドを実行
      const result = await repository.findByOrderId(orderId);

      // 検証
      expect(mockPrismaPayment.findUnique).toHaveBeenCalledWith({
        where: { orderId: "order-456" },
      });
      expect(result).toBeInstanceOf(Payment);
      expect(result?.orderId.getValue()).toBe("order-456");
      expect(result?.status).toBe(EnumPaymentStatus.PENDING);
    });

    it("should return null when no payment is found for the order", async () => {
      // モックの戻り値を設定
      mockPrismaPayment.findUnique.mockResolvedValue(null);

      // OrderIdを作成
      const orderId = new OrderId("nonexistent-order");

      // メソッドを実行
      const result = await repository.findByOrderId(orderId);

      // 検証
      expect(result).toBeNull();
    });
  });

  describe("save", () => {
    it("should create a new payment", async () => {
      // モックの戻り値を設定
      mockPrismaPayment.create.mockResolvedValue(mockPaymentData);

      // 新しい支払いを作成
      const newPayment = new Payment({
        orderId: "order-456",
        amount: 100,
        fee: 5,
        method: EnumPaymentMethod.CREDIT_CARD,
        status: EnumPaymentStatus.PENDING,
      });

      // メソッドを実行
      const result = await repository.save(newPayment);

      // 検証
      expect(mockPrismaPayment.create).toHaveBeenCalledWith({
        data: {
          orderId: "order-456",
          amount: 100,
          fee: 5,
          method: EnumPaymentMethod.CREDIT_CARD,
          status: EnumPaymentStatus.PENDING,
        },
      });
      expect(result).toBeInstanceOf(Payment);
      expect(result?.id?.getValue()).toBe("payment-123"); // モックの返り値から
      expect(result?.orderId.getValue()).toBe("order-456");
      expect(result?.amount.getAmount()).toBe(100);
    });

    it("should return null when trying to save a payment with existing id", async () => {
      // 既存IDを持つ支払いを作成
      const existingPayment = new Payment({
        id: "existing-payment",
        orderId: "order-456",
        amount: 100,
        fee: 5,
        method: EnumPaymentMethod.CREDIT_CARD,
        status: EnumPaymentStatus.PENDING,
      });

      // spyOnを使って、hasId()が真を返すように設定
      jest.spyOn(existingPayment, "hasId").mockReturnValue(true);

      // メソッドを実行
      const result = await repository.save(existingPayment);

      // 検証
      expect(mockPrismaPayment.create).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update an existing payment", async () => {
      // モックの戻り値を設定
      mockPrismaPayment.update.mockResolvedValue({
        ...mockPaymentData,
        status: EnumPaymentStatus.PROCESSED,
        processedAt: new Date(),
      });

      // 更新する支払いを作成
      const updatedPayment = new Payment({
        id: "payment-123",
        orderId: "order-456",
        amount: 100,
        fee: 5,
        method: EnumPaymentMethod.CREDIT_CARD,
        status: EnumPaymentStatus.PROCESSED,
        createdAt: new Date(),
        processedAt: new Date(),
      });

      // spyOnを使って、hasId()が真を返すように設定
      jest.spyOn(updatedPayment, "hasId").mockReturnValue(true);

      // メソッドを実行
      await repository.update(updatedPayment);

      // 検証
      expect(mockPrismaPayment.update).toHaveBeenCalledWith({
        where: { id: "payment-123" },
        data: {
          status: EnumPaymentStatus.PROCESSED,
          processedAt: expect.any(Date),
        },
      });
    });

    it("should throw error when payment has no id", async () => {
      // IDなしの支払いを作成
      const paymentWithoutId = new Payment({
        orderId: "order-456",
        amount: 100,
        fee: 5,
        method: EnumPaymentMethod.CREDIT_CARD,
        status: EnumPaymentStatus.PENDING,
      });

      // spyOnを使って、hasId()が偽を返すように設定
      jest.spyOn(paymentWithoutId, "hasId").mockReturnValue(false);

      // メソッドを実行と検証
      await expect(repository.update(paymentWithoutId)).rejects.toThrow(
        "Payment ID is required for update",
      );
      expect(mockPrismaPayment.update).not.toHaveBeenCalled();
    });
  });
});
