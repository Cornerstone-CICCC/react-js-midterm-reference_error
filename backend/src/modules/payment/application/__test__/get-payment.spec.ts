import { Test } from "@nestjs/testing";
import { OrderId } from "../../../order/domain/order.value-objects";
import { Payment } from "../../domain/payment.entity";
import { EnumPaymentMethod, EnumPaymentStatus, PaymentId } from "../../domain/payment.value-object";
import { IPaymentRepository } from "../../repositories/payment.repository.interface";
import { GetPaymentUseCase } from "../usecases/get-payment";

describe("GetPaymentUseCase", () => {
  let useCase: GetPaymentUseCase;
  let paymentRepository: jest.Mocked<IPaymentRepository>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");
  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // Mock the repository
    const paymentRepositoryMock = {
      findById: jest.fn(),
      findByOrderId: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetPaymentUseCase,
        {
          provide: "IPaymentRepository",
          useValue: paymentRepositoryMock,
        },
      ],
    }).compile();

    // Get the use case and repository from the module
    useCase = moduleRef.get<GetPaymentUseCase>(GetPaymentUseCase);
    paymentRepository = moduleRef.get("IPaymentRepository") as jest.Mocked<IPaymentRepository>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully get payment by ID", async () => {
    // Payment ID and Order ID for the test
    const paymentId = "payment-123";
    const orderId = "order-123";

    // Create an instance of Payment with the necessary properties
    const paymentData = {
      id: paymentId,
      orderId: orderId,
      amount: 100,
      fee: 5,
      method: EnumPaymentMethod.CREDIT_CARD,
      status: EnumPaymentStatus.PROCESSED,
      createdAt: fixedDate,
      processedAt: fixedDate,
    };

    // Mock the repository methods
    paymentRepository.findById.mockResolvedValue(new Payment(paymentData));

    // Execute the use case
    const result = await useCase.executeById(paymentId);

    // Assert the results
    expect(paymentRepository.findById).toHaveBeenCalledWith(new PaymentId(paymentId));
    expect(result).toEqual(paymentData);
  });

  it("should return null when payment is not found by ID", async () => {
    // Payment ID for the test
    const paymentId = "nonexistent-payment";

    // Mock the repository methods
    paymentRepository.findById.mockResolvedValue(null);

    // Execute the use case
    const result = await useCase.executeById(paymentId);

    // Assert the results
    expect(paymentRepository.findById).toHaveBeenCalledWith(new PaymentId(paymentId));
    expect(result).toBeNull();
  });

  it("should successfully get payment by order ID", async () => {
    // Payment ID and Order ID for the test
    const paymentId = "payment-456";
    const orderId = "order-456";

    // Create an instance of Payment with the necessary properties
    const paymentData = {
      id: paymentId,
      orderId: orderId,
      amount: 200,
      fee: 10,
      method: EnumPaymentMethod.PAYPAL,
      status: EnumPaymentStatus.PROCESSED,
      createdAt: fixedDate,
      processedAt: fixedDate,
    };

    // Mock the repository methods
    paymentRepository.findByOrderId.mockResolvedValue(new Payment(paymentData));

    // Execute the use case
    const result = await useCase.executeByOrderId(orderId);

    // Assert the results
    expect(paymentRepository.findByOrderId).toHaveBeenCalledWith(new OrderId(orderId));
    expect(result).toEqual(paymentData);
  });

  it("should return null when payment is not found by order ID", async () => {
    // Order ID for the test
    const orderId = "nonexistent-order";

    // Mock the repository methods
    paymentRepository.findByOrderId.mockResolvedValue(null);

    //　Execute the use case
    const result = await useCase.executeByOrderId(orderId);

    // Assert the results
    expect(paymentRepository.findByOrderId).toHaveBeenCalledWith(new OrderId(orderId));
    expect(result).toBeNull();
  });
});
