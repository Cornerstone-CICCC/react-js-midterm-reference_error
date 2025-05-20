import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Order } from "../../domain/order.entity";
import { EnumOrderStatus, OrderId } from "../../domain/order.value-objects";
import { IOrderRepository } from "../../repositories/order.repository.interface";
import { GetOrderUseCase } from "../usecases/get-order";

describe("GetOrderUseCase", () => {
  let useCase: GetOrderUseCase;
  let orderRepository: jest.Mocked<IOrderRepository>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");
  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // Mock the repository

    const orderRepositoryMock = {
      findById: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetOrderUseCase,
        {
          provide: "IOrderRepository",
          useValue: orderRepositoryMock,
        },
      ],
    }).compile();

    // Get the use case and repository from the module
    useCase = moduleRef.get<GetOrderUseCase>(GetOrderUseCase);
    orderRepository = moduleRef.get("IOrderRepository") as jest.Mocked<IOrderRepository>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully create a order", async () => {
    // Buyer ID, Order ID, and Seller ID for the test
    const buyerId = "buyer-123";
    const orderId = "order-123";
    const sellerId = "seller-123";

    // Create an instance of Order with the necessary properties
    const orderData = {
      id: orderId,
      productId: "product-123",
      buyerId: buyerId,
      sellerId: sellerId,
      finalPrice: 100,
      status: EnumOrderStatus.CREATED,
      createdAt: fixedDate,
      paidAt: undefined,
      completedAt: undefined,
    };

    // Mock the repository methods
    orderRepository.findById.mockResolvedValue(new Order(orderData));

    // Execute the use case
    const result = await useCase.execute(buyerId, orderId);

    // Assertions
    expect(orderRepository.findById).toHaveBeenCalledWith(new OrderId(orderId));
    expect(orderData).toStrictEqual(result);
  });

  it("should throw NotFoundException when user is not found", async () => {
    // User ID and Order ID for the test
    const userId = "nonexistent-user";
    const orderId = "order-123";

    // Execute the use case and expect an exception
    await expect(useCase.execute(userId, orderId)).rejects.toThrow(NotFoundException);
    expect(orderRepository.findById).toHaveBeenCalledWith(new OrderId(orderId));
  });
});
