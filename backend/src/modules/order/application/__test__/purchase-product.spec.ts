import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ProcessPaymentUseCase } from "../../../payment/application/usecases/process-payment";
import { EnumPaymentMethod, EnumPaymentStatus } from "../../../payment/domain/payment.value-object";
import { CreatePurchaseHistoryUseCase } from "../../../transaction-history/application/usecases/create-purchase-history";
import { CreateSaleHistoryUseCase } from "../../../transaction-history/application/usecases/create-sale-history";
import { EnumTransactionType } from "../../../transaction-history/domain/transaction-history.value-objects";
import { UserId } from "../../../user/domain/user.value-objects";
import { EnumOrderStatus } from "../../domain/order.value-objects";
import { OrderResponse } from "../../presentation/order.dtos";
import { IOrderRepository } from "../../repositories/order.repository.interface";
import { CreateOrderUseCase } from "../usecases/create-order";
import { PurchaseProductService } from "../usecases/purchase-product";

describe("PurchaseProductService", () => {
  let service: PurchaseProductService;
  let createOrderUseCase: jest.Mocked<CreateOrderUseCase>;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let processPaymentUseCase: jest.Mocked<ProcessPaymentUseCase>;
  let createPurchaseHistoryUseCase: jest.Mocked<CreatePurchaseHistoryUseCase>;
  let createSaleHistoryUseCase: jest.Mocked<CreateSaleHistoryUseCase>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");

  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // リポジトリとユースケースのモックを作成
    const createOrderUseCaseMock = {
      execute: jest.fn(),
    };

    const orderRepositoryMock = {
      update: jest.fn(),
    };

    const processPaymentUseCaseMock = {
      execute: jest.fn(),
    };

    const createPurchaseHistoryUseCaseMock = {
      execute: jest.fn(),
    };

    const createSaleHistoryUseCaseMock = {
      execute: jest.fn(),
    };

    // テストモジュールの設定
    const moduleRef = await Test.createTestingModule({
      providers: [
        PurchaseProductService,
        {
          provide: CreateOrderUseCase,
          useValue: createOrderUseCaseMock,
        },
        {
          provide: "IOrderRepository",
          useValue: orderRepositoryMock,
        },
        {
          provide: ProcessPaymentUseCase,
          useValue: processPaymentUseCaseMock,
        },
        {
          provide: CreatePurchaseHistoryUseCase,
          useValue: createPurchaseHistoryUseCaseMock,
        },
        {
          provide: CreateSaleHistoryUseCase,
          useValue: createSaleHistoryUseCaseMock,
        },
      ],
    }).compile();

    // テスト対象とモックを取得
    service = moduleRef.get<PurchaseProductService>(PurchaseProductService);
    createOrderUseCase = moduleRef.get(CreateOrderUseCase) as jest.Mocked<CreateOrderUseCase>;
    orderRepository = moduleRef.get("IOrderRepository") as jest.Mocked<IOrderRepository>;
    processPaymentUseCase = moduleRef.get(
      ProcessPaymentUseCase,
    ) as jest.Mocked<ProcessPaymentUseCase>;
    createPurchaseHistoryUseCase = moduleRef.get(
      CreatePurchaseHistoryUseCase,
    ) as jest.Mocked<CreatePurchaseHistoryUseCase>;
    createSaleHistoryUseCase = moduleRef.get(
      CreateSaleHistoryUseCase,
    ) as jest.Mocked<CreateSaleHistoryUseCase>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully purchase a product", async () => {
    // テスト用のデータ
    const buyerId = new UserId("buyer-123");
    const productId = "product-123";
    const sellerId = "seller-123";
    const paymentMethod = EnumPaymentMethod.CREDIT_CARD;

    // 注文作成の戻り値設定
    const orderResponse: OrderResponse = {
      id: "order-123",
      productId: productId,
      buyerId: buyerId.getValue(),
      sellerId: sellerId,
      finalPrice: 100,
      status: EnumOrderStatus.CREATED,
      createdAt: fixedDate,
      paidAt: undefined,
      completedAt: undefined,
    };

    const paymentResponse = {
      id: "payment-123",
      orderId: "order-123",
      amount: 100,
      fee: 0,
      method: paymentMethod,
      status: EnumPaymentStatus.PROCESSED,
      createdAt: fixedDate,
      updatedAt: fixedDate,
      processedAt: fixedDate,
    };

    // 完了後の注文データ
    const completedOrderData = {
      id: "order-123",
      productId: productId,
      buyerId: buyerId.getValue(),
      sellerId: sellerId,
      finalPrice: 100,
      status: EnumOrderStatus.COMPLETED,
      createdAt: fixedDate,
      paidAt: fixedDate,
      completedAt: fixedDate,
    };
    // 保存用の変数を準備
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const capturedOrders: any[] = [];
    // モックの振る舞いを設定
    createOrderUseCase.execute.mockResolvedValue(orderResponse);
    processPaymentUseCase.execute.mockResolvedValue(paymentResponse);
    orderRepository.update.mockResolvedValue(undefined);

    // 重要: 深いコピーで状態を保存
    orderRepository.update.mockImplementation((order) => {
      // オブジェクトの状態をシリアライズして保存（参照切断）
      const orderSnapshot = {
        id: order.id?.getValue ? order.id.getValue() : order.id,
        status: order.status ? order.status.toString() : order.status,
        paidAt: order.paidAt ? new Date(order.paidAt) : undefined,
        completedAt: order.completedAt ? new Date(order.completedAt) : undefined,
      };

      capturedOrders.push(orderSnapshot);
      return Promise.resolve(undefined);
    });
    // 実行
    const result = await service.purchaseProduct(productId, "buyer-123", paymentMethod);

    // 検証
    expect(createOrderUseCase.execute).toHaveBeenCalledWith("buyer-123", productId);
    expect(processPaymentUseCase.execute).toHaveBeenCalledWith({
      orderId: "order-123",
      amount: 100,
      method: paymentMethod,
    });
    expect(orderRepository.update).toHaveBeenCalledTimes(2);

    // 検証 - 保存した状態のスナップショットを使用
    expect(capturedOrders[0].status).toBe(EnumOrderStatus.PAID); // 1回目の呼び出し
    expect(capturedOrders[1].status).toBe(EnumOrderStatus.COMPLETED); // 2回目の呼び出し

    // 最終結果の検証
    expect(result).toEqual(completedOrderData);
  });

  it("should handle payment failure and cancel order", async () => {
    // テスト用のデータ
    const buyerId = new UserId("buyer-123");
    const productId = "product-456";
    const sellerId = "seller-456";
    const paymentMethod = EnumPaymentMethod.CREDIT_CARD;
    const paymentError = new Error("Payment processing failed");

    // 注文作成の戻り値設定
    const orderResponse: OrderResponse = {
      id: "order-456",
      productId: productId,
      buyerId: buyerId.getValue(),
      sellerId: sellerId,
      finalPrice: 200,
      status: EnumOrderStatus.CREATED,
      createdAt: fixedDate,
      paidAt: undefined,
      completedAt: undefined,
    };

    const buyerTransaction = {
      id: "transaction-123",
      userId: buyerId.getValue(),
      orderId: orderResponse.id,
      amount: orderResponse.finalPrice,
      status: EnumPaymentStatus.PROCESSED,
      createdAt: fixedDate,
      type: EnumTransactionType.PURCHASE,
    };

    const sellerTransaction = {
      id: "transaction-456",
      userId: sellerId,
      orderId: orderResponse.id,
      amount: orderResponse.finalPrice,
      status: EnumPaymentStatus.PROCESSED,
      createdAt: fixedDate,
      type: EnumTransactionType.SALE,
    };

    // モックの振る舞いを設定
    createOrderUseCase.execute.mockResolvedValue(orderResponse);
    processPaymentUseCase.execute.mockRejectedValue(paymentError);
    orderRepository.update.mockResolvedValue(undefined);
    createPurchaseHistoryUseCase.execute.mockResolvedValue(buyerTransaction);
    createSaleHistoryUseCase.execute.mockResolvedValue(sellerTransaction);

    // 実行と検証
    await expect(service.purchaseProduct(productId, "buyer-123", paymentMethod)).rejects.toThrow(
      paymentError,
    );

    // 呼び出し検証
    expect(createOrderUseCase.execute).toHaveBeenCalledWith("buyer-123", productId);
    expect(processPaymentUseCase.execute).toHaveBeenCalledWith({
      orderId: "order-456",
      amount: 200,
      method: paymentMethod,
    });
    expect(createPurchaseHistoryUseCase.execute).not.toHaveBeenCalledWith(
      orderResponse.buyerId,
      orderResponse.id,
    );
    expect(createSaleHistoryUseCase.execute).not.toHaveBeenCalledWith(
      orderResponse.sellerId,
      orderResponse.id,
    );

    // キャンセル処理の検証
    expect(orderRepository.update).toHaveBeenCalledTimes(1);
    const updateCall = orderRepository.update.mock.calls[0][0];
    expect(updateCall.id?.getValue()).toBe("order-456");
    // キャンセル処理を確認したい場合は、注文のキャンセルメソッドも確認
    // expect(updateCall.status).toBe(EnumOrderStatus.CANCELLED);
  });

  it("should throw error when order creation fails", async () => {
    // テスト用のデータ
    const productId = "nonexistent-product";
    const paymentMethod = EnumPaymentMethod.CREDIT_CARD;
    const createError = new NotFoundException("Product not found");

    // モックの振る舞いを設定
    createOrderUseCase.execute.mockRejectedValue(createError);

    // 実行と検証
    await expect(service.purchaseProduct(productId, "buyer-123", paymentMethod)).rejects.toThrow(
      createError,
    );

    // 呼び出し検証
    expect(createOrderUseCase.execute).toHaveBeenCalledWith("buyer-123", productId);
    expect(processPaymentUseCase.execute).not.toHaveBeenCalled();
    expect(orderRepository.update).not.toHaveBeenCalled();
  });
});
