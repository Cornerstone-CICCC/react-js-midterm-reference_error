import { Test, TestingModule } from "@nestjs/testing";
import { EnumPaymentMethod } from "../../../payment/domain/payment.value-object";
import { CompleteOrderUseCase } from "../../application/usecases/complete-order";
import { CreateOrderUseCase } from "../../application/usecases/create-order";
import { GetOrderUseCase } from "../../application/usecases/get-order";
import { PurchaseProductService } from "../../application/usecases/purchase-product";
import { EnumOrderStatus } from "../../domain/order.value-objects";
import {
  CreateOrderInput,
  OrderResponse,
  PurchaseProductInput,
} from "../../presentation/order.dtos";
import { OrderResolver } from "../../presentation/order.resolver";

describe("OrderResolver (Integration)", () => {
  let moduleRef: TestingModule;
  let orderResolver: OrderResolver;
  let getOrderUseCase: GetOrderUseCase;
  let createOrderUseCase: CreateOrderUseCase;
  let completeOrderUseCase: CompleteOrderUseCase;
  let purchaseProductService: PurchaseProductService;

  // サンプル注文レスポンス
  const sampleOrderResponse: OrderResponse = {
    id: "order-123",
    productId: "product-456",
    buyerId: "user-789",
    sellerId: "user-012",
    finalPrice: 100,
    status: EnumOrderStatus.CREATED,
    createdAt: new Date(),
    paidAt: undefined,
    completedAt: undefined,
  };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        OrderResolver,
        {
          provide: GetOrderUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CreateOrderUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CompleteOrderUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: PurchaseProductService,
          useValue: {
            purchaseProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    // クラスのインスタンスを取得
    orderResolver = moduleRef.get<OrderResolver>(OrderResolver);
    getOrderUseCase = moduleRef.get<GetOrderUseCase>(GetOrderUseCase);
    createOrderUseCase = moduleRef.get<CreateOrderUseCase>(CreateOrderUseCase);
    completeOrderUseCase = moduleRef.get<CompleteOrderUseCase>(CompleteOrderUseCase);
    purchaseProductService = moduleRef.get<PurchaseProductService>(PurchaseProductService);
  });

  // 商品購入テスト
  it("should purchase a product and return order response", async () => {
    // PurchaseProductServiceのモック設定
    const purchaseSpy = jest.spyOn(purchaseProductService, "purchaseProduct").mockResolvedValue({
      ...sampleOrderResponse,
      status: EnumOrderStatus.PAID,
      paidAt: new Date(),
    });

    // 商品購入用の入力データ
    const purchaseInput: PurchaseProductInput = {
      productId: "product-456",
      paymentMethod: EnumPaymentMethod.CREDIT_CARD,
    };

    // purchaseProductメソッドを実行
    const result = await orderResolver.purchaseProduct(purchaseInput, "user-123");

    // 検証
    expect(purchaseProductService.purchaseProduct).toHaveBeenCalled();
    expect(purchaseSpy).toHaveBeenCalledWith(
      "product-456",
      "user-123",
      EnumPaymentMethod.CREDIT_CARD,
    );
    expect(result).toEqual({
      ...sampleOrderResponse,
      status: EnumOrderStatus.PAID,
      paidAt: expect.any(Date),
    });
  });

  // 注文取得テスト
  it("should get an order by ID and return order response", async () => {
    // GetOrderUseCaseのモック設定
    const getSpy = jest.spyOn(getOrderUseCase, "execute").mockResolvedValue(sampleOrderResponse);

    // getOrderByIdメソッドを実行
    const result = await orderResolver.getOrderById("user-123", "order-123");

    // 検証
    expect(getOrderUseCase.execute).toHaveBeenCalled();
    expect(getSpy).toHaveBeenCalledWith("user-123", "order-123");
    expect(result).toEqual(sampleOrderResponse);
  });

  // 注文作成テスト
  it("should create an order and return order response", async () => {
    // CreateOrderUseCaseのモック設定
    const createSpy = jest
      .spyOn(createOrderUseCase, "execute")
      .mockResolvedValue(sampleOrderResponse);

    // 注文作成用の入力データ
    const createInput: CreateOrderInput = {
      productId: "product-456",
    };

    // createOrderメソッドを実行
    const result = await orderResolver.createOrder("user-123", createInput);

    // 検証
    expect(createOrderUseCase.execute).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledWith("user-123", "product-456");
    expect(result).toEqual(sampleOrderResponse);
  });

  // 注文完了テスト
  it("should complete an order and return updated order response", async () => {
    // CompleteOrderUseCaseのモック設定
    const completeSpy = jest.spyOn(completeOrderUseCase, "execute").mockResolvedValue({
      ...sampleOrderResponse,
      status: EnumOrderStatus.COMPLETED,
      completedAt: new Date(),
    });

    // completeOrderメソッドを実行
    const result = await orderResolver.completeOrder("order-123");

    // 検証
    expect(completeOrderUseCase.execute).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalledWith("order-123");
    expect(result).toEqual({
      ...sampleOrderResponse,
      status: EnumOrderStatus.COMPLETED,
      completedAt: expect.any(Date),
    });
  });
});
