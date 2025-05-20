import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Order } from "../../domain/order.entity";
import { EnumOrderStatus, OrderId } from "../../domain/order.value-objects";
import { IOrderRepository } from "../../repositories/order.repository.interface";
import { CompleteOrderUseCase } from "../usecases/complete-order";

describe("CompleteOrderUseCase", () => {
  let useCase: CompleteOrderUseCase;
  let orderRepository: jest.Mocked<IOrderRepository>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");
  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // Set up mocks for the repository
    const orderRepositoryMock = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        CompleteOrderUseCase,
        {
          provide: "IOrderRepository",
          useValue: orderRepositoryMock,
        },
      ],
    }).compile();

    // Get the use case and repository from the module
    useCase = moduleRef.get<CompleteOrderUseCase>(CompleteOrderUseCase);
    orderRepository = moduleRef.get("IOrderRepository") as jest.Mocked<IOrderRepository>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully complete a order", async () => {
    // Order ID for the test
    const orderId = "order-123";

    // Create an instance of Order with the necessary properties
    const oldOrder = new Order({
      id: orderId,
      productId: "product-123",
      buyerId: "buyer-123",
      sellerId: "seller-123",
      finalPrice: 100,
      status: EnumOrderStatus.PAID,
      createdAt: fixedDate,
      paidAt: fixedDate,
      completedAt: undefined,
    });

    const completeSpy = jest.spyOn(oldOrder, "complete");

    // Mock the repository methods
    orderRepository.findById.mockResolvedValue(oldOrder);
    orderRepository.update.mockImplementation((updatedOrder) => {
      expect(updatedOrder.status).toBe(EnumOrderStatus.COMPLETED);
      expect(updatedOrder.completedAt).toEqual(fixedDate);
      return Promise.resolve(undefined);
    });

    // Execute the use case
    const result = await useCase.execute(orderId);

    // Assertions
    expect(orderRepository.findById).toHaveBeenCalledWith(new OrderId(orderId));
    expect(completeSpy).toHaveBeenCalled();
    expect(orderRepository.update).toHaveBeenCalled();
    const updatedOrder = orderRepository.update.mock.calls[0][0];
    expect(updatedOrder.status).toBe(EnumOrderStatus.COMPLETED);
    expect(updatedOrder.completedAt).toEqual(fixedDate);
    expect(result.id).toBe(orderId);
    expect(result.status).toBe(EnumOrderStatus.COMPLETED);
  });

  it("should throw NotFoundException when order is not found", async () => {
    // Order ID for the test
    const orderId = new OrderId("nonexistent-order");

    // Mock the repository methods to simulate not finding the order
    orderRepository.findById.mockResolvedValue(null);
    orderRepository.update.mockResolvedValue(undefined);

    // Execute the use case and expect it to throw NotFoundException
    await expect(useCase.execute(orderId.getValue())).rejects.toThrow(NotFoundException);
    expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
    expect(orderRepository.update).not.toHaveBeenCalled();
  });

  it("should throw Error when completing order fails", async () => {
    // Order ID for the test
    const orderId = new OrderId("order-456");

    // Create an instance of Order with the necessary properties
    const oldOrder = new Order({
      id: orderId.getValue(),
      productId: "product-456",
      buyerId: "buyer-456",
      sellerId: "seller-456",
      finalPrice: 200,
      status: EnumOrderStatus.PAID,
      createdAt: fixedDate,
      paidAt: undefined,
      completedAt: undefined,
    });

    // Mock the repository methods
    orderRepository.findById.mockResolvedValue(oldOrder);

    // Simulate an error when updating the order
    orderRepository.update.mockRejectedValue(new Error("Failed to complete order"));

    orderRepository.update.mockImplementation(() => {
      throw new Error("Failed to complete order");
    });

    // Execute the use case and expect it to throw an error
    await expect(useCase.execute(orderId.getValue())).rejects.toThrow("Failed to complete order");
    expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
    expect(orderRepository.update).toHaveBeenCalledWith(expect.any(Order));
  });
});
