import { Test, TestingModule } from "@nestjs/testing";
import { GetPaymentUseCase } from "../../application/usecases/get-payment";
import { ProcessPaymentUseCase } from "../../application/usecases/process-payment";
import { EnumPaymentMethod, EnumPaymentStatus } from "../../domain/payment.value-object";
import { PaymentResponseDto, ProcessPaymentInput } from "../../presentation/payment.dto";
import { PaymentResolver } from "../../presentation/payment.resolver";

describe("PaymentResolver (Integration)", () => {
  let moduleRef: TestingModule;
  let paymentResolver: PaymentResolver;
  let getPaymentUseCase: GetPaymentUseCase;
  let processPaymentUseCase: ProcessPaymentUseCase;

  // サンプル決済レスポンス
  const samplePaymentResponse: PaymentResponseDto = {
    id: "payment-123",
    orderId: "order-456",
    amount: 100,
    fee: 5,
    method: EnumPaymentMethod.CREDIT_CARD,
    status: EnumPaymentStatus.PENDING,
    createdAt: new Date(),
    processedAt: new Date(),
  };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        PaymentResolver,
        {
          provide: GetPaymentUseCase,
          useValue: {
            executeByOrderId: jest.fn(),
          },
        },
        {
          provide: ProcessPaymentUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    // クラスのインスタンスを取得
    paymentResolver = moduleRef.get<PaymentResolver>(PaymentResolver);
    getPaymentUseCase = moduleRef.get<GetPaymentUseCase>(GetPaymentUseCase);
    processPaymentUseCase = moduleRef.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
  });

  // 決済処理テスト
  it("should process payment and return payment response", async () => {
    // ProcessPaymentUseCaseのモック設定
    const processSpy = jest
      .spyOn(processPaymentUseCase, "execute")
      .mockResolvedValue(samplePaymentResponse);

    // 決済処理用の入力データ
    const paymentInput: ProcessPaymentInput = {
      orderId: "order-456",
      amount: 100,
      method: EnumPaymentMethod.CREDIT_CARD,
    };

    // processPaymentメソッドを実行
    const result = await paymentResolver.processPayment(paymentInput);

    // 検証
    expect(processPaymentUseCase.execute).toHaveBeenCalled();
    expect(processSpy).toHaveBeenCalledWith({
      orderId: "order-456",
      amount: 100,
      method: EnumPaymentMethod.CREDIT_CARD,
    });
    expect(result).toEqual(samplePaymentResponse);
  });

  // 注文IDによる決済情報取得テスト
  it("should get payment by order ID and return payment response", async () => {
    // GetPaymentUseCaseのモック設定
    const getSpy = jest
      .spyOn(getPaymentUseCase, "executeByOrderId")
      .mockResolvedValue(samplePaymentResponse);

    // getPaymentByOrderIdメソッドを実行
    const result = await paymentResolver.getPaymentByOrderId("order-456");

    // 検証
    expect(getPaymentUseCase.executeByOrderId).toHaveBeenCalled();
    expect(getSpy).toHaveBeenCalledWith("order-456");
    expect(result).toEqual(samplePaymentResponse);
  });

  // 注文IDによる決済情報が見つからないケースのテスト
  it("should return null when payment is not found by order ID", async () => {
    // GetPaymentUseCaseのモック設定（nullを返す）
    const getSpy = jest.spyOn(getPaymentUseCase, "executeByOrderId").mockResolvedValue(null);

    // getPaymentByOrderIdメソッドを実行
    const result = await paymentResolver.getPaymentByOrderId("non-existent-order");

    // 検証
    expect(getPaymentUseCase.executeByOrderId).toHaveBeenCalled();
    expect(getSpy).toHaveBeenCalledWith("non-existent-order");
    expect(result).toBeNull();
  });
});
