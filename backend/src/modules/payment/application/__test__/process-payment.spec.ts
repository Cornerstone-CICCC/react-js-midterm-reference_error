import { Test } from "@nestjs/testing";
import { OrderId } from "../../../order/domain/order.value-objects";
import { IPaymentGateway } from "../../domain/payment-gateway.interface";
import { Payment } from "../../domain/payment.entity";
import { EnumPaymentMethod, EnumPaymentStatus } from "../../domain/payment.value-object";
import { IPaymentRepository } from "../../repositories/payment.repository.interface";
import { ProcessPaymentCommand, ProcessPaymentUseCase } from "../usecases/process-payment";

describe("ProcessPaymentUseCase", () => {
  let useCase: ProcessPaymentUseCase;
  let paymentRepository: jest.Mocked<IPaymentRepository>;
  let paymentGateway: jest.Mocked<IPaymentGateway>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");

  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // リポジトリとゲートウェイのモックを作成
    const paymentRepositoryMock = {
      save: jest.fn(),
      update: jest.fn(),
    };

    const paymentGatewayMock = {
      processPayment: jest.fn(),
    };

    // テストモジュールの設定
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProcessPaymentUseCase,
        {
          provide: "IPaymentRepository",
          useValue: paymentRepositoryMock,
        },
        {
          provide: "IPaymentGateway",
          useValue: paymentGatewayMock,
        },
      ],
    }).compile();

    // テスト対象とモックを取得
    useCase = moduleRef.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
    paymentRepository = moduleRef.get("IPaymentRepository") as jest.Mocked<IPaymentRepository>;
    paymentGateway = moduleRef.get("IPaymentGateway") as jest.Mocked<IPaymentGateway>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully process a payment", async () => {
    // テスト用のコマンド
    const command: ProcessPaymentCommand = {
      orderId: "order-123",
      amount: 100,
      method: EnumPaymentMethod.CREDIT_CARD,
    };

    // メソッドのスパイ設定
    const processPaymentSpy = jest.spyOn(Payment.prototype, "process");

    // リポジトリとゲートウェイのモック設定
    paymentRepository.save.mockResolvedValue(
      new Payment({
        id: "payment-123",
        orderId: command.orderId,
        amount: command.amount,
        method: command.method,
        status: EnumPaymentStatus.PENDING,
        createdAt: fixedDate,
        processedAt: undefined,
      }),
    );

    paymentRepository.update.mockResolvedValue(undefined);

    // ゲートウェイの成功レスポンス
    paymentGateway.processPayment.mockResolvedValue({
      success: true,
      transactionId: "tx-123456",
    });

    // 実行
    const result = await useCase.execute(command);

    // 検証
    // 1. リポジトリ保存が呼ばれたこと
    expect(paymentRepository.save).toHaveBeenCalled();

    // 2. ゲートウェイ処理が呼ばれたこと
    expect(paymentGateway.processPayment).toHaveBeenCalledWith(command.amount, command.method, {
      orderId: new OrderId(command.orderId),
    });

    // 3. 支払い処理成功後にprocess()が呼ばれたこと
    expect(processPaymentSpy).toHaveBeenCalled();

    // 4. 更新が呼ばれたこと
    expect(paymentRepository.update).toHaveBeenCalled();

    // 5. 戻り値が正しいこと
    expect(result).toEqual(
      expect.objectContaining({
        orderId: command.orderId,
        amount: command.amount,
        method: command.method,
        status: EnumPaymentStatus.PROCESSED,
      }),
    );
  });

  it("should handle payment gateway failure", async () => {
    // テスト用のコマンド
    const command: ProcessPaymentCommand = {
      orderId: "order-456",
      amount: 200,
      method: EnumPaymentMethod.PAYPAL,
    };

    // メソッドのスパイ設定
    const failPaymentSpy = jest.spyOn(Payment.prototype, "fail");

    const payment = new Payment({
      orderId: command.orderId,
      amount: command.amount,
      method: command.method,
    });

    // リポジトリとゲートウェイのモック設定
    paymentRepository.save.mockResolvedValue(payment);
    paymentRepository.update.mockResolvedValue(undefined);

    // ゲートウェイの失敗レスポンス
    paymentGateway.processPayment.mockResolvedValue({
      success: false,
      error: "Insufficient funds",
    });

    // 実行と検証
    await expect(useCase.execute(command)).rejects.toThrow("Insufficient funds");

    // 失敗後の処理検証
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(paymentGateway.processPayment).toHaveBeenCalled();
    expect(failPaymentSpy).toHaveBeenCalled();
    expect(paymentRepository.update).toHaveBeenCalled();
  });

  it("should handle payment gateway exception", async () => {
    // テスト用のコマンド
    const command: ProcessPaymentCommand = {
      orderId: "order-789",
      amount: 300,
      method: EnumPaymentMethod.DEBIT_CARD,
    };

    // メソッドのスパイ設定
    const failPaymentSpy = jest.spyOn(Payment.prototype, "fail");
    const payment = new Payment({
      orderId: command.orderId,
      amount: command.amount,
      method: command.method,
    });
    // リポジトリとゲートウェイのモック設定
    paymentRepository.save.mockResolvedValue(payment);
    paymentRepository.update.mockResolvedValue(undefined);

    // ゲートウェイの例外
    const gatewayError = new Error("Connection error");
    paymentGateway.processPayment.mockRejectedValue(gatewayError);

    // 実行と検証
    await expect(useCase.execute(command)).rejects.toThrow(gatewayError);

    // 例外後の処理検証
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(paymentGateway.processPayment).toHaveBeenCalled();
    expect(failPaymentSpy).toHaveBeenCalled();
    expect(paymentRepository.update).toHaveBeenCalled();
  });

  it("should handle repository save failure", async () => {
    // テスト用のコマンド
    const command: ProcessPaymentCommand = {
      orderId: "order-999",
      amount: 400,
      method: EnumPaymentMethod.CREDIT_CARD,
    };

    // リポジトリの失敗設定
    const saveError = new Error("Database connection error");
    paymentRepository.save.mockRejectedValue(saveError);

    // 実行と検証
    await expect(useCase.execute(command)).rejects.toThrow(saveError);

    // ゲートウェイが呼ばれないことを確認
    expect(paymentGateway.processPayment).not.toHaveBeenCalled();
    expect(paymentRepository.update).not.toHaveBeenCalled();
  });
});
