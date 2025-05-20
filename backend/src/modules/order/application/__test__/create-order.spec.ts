import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Product } from "../../../product/domain/product.entity";
import {
  EnumCategory,
  EnumProductCondition,
  EnumProductStatus,
  ProductId,
} from "../../../product/domain/product.value-object";
import { IProductRepository } from "../../../product/repositories/product.repository.interfaces";
import { UserId } from "../../../user/domain/user.value-objects";
import { Order } from "../../domain/order.entity";
import { EnumOrderStatus } from "../../domain/order.value-objects";
import { IOrderRepository } from "../../repositories/order.repository.interface";
import { CreateOrderUseCase } from "../usecases/create-order";

describe("CreateOrderUseCase", () => {
  let useCase: CreateOrderUseCase;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let productRepository: jest.Mocked<IProductRepository>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");
  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // Mock the repositories

    const orderRepositoryMock = {
      save: jest.fn(),
    };

    const productRepositoryMock = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        {
          provide: "IOrderRepository",
          useValue: orderRepositoryMock,
        },

        {
          provide: "IProductRepository",
          useValue: productRepositoryMock,
        },
      ],
    }).compile();

    // Get the use case and repository from the module
    useCase = moduleRef.get<CreateOrderUseCase>(CreateOrderUseCase);
    orderRepository = moduleRef.get("IOrderRepository") as jest.Mocked<IOrderRepository>;
    productRepository = moduleRef.get("IProductRepository") as jest.Mocked<IProductRepository>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully create a order", async () => {
    // Ids for the test
    const productId = "product-123";
    const sellerId = "seller-123";

    // Create an instance of Product with the necessary properties
    const oldProduct = new Product({
      id: productId,
      title: "Test Product",
      description: "Test Description",
      price: 100,
      status: EnumProductStatus.AVAILABLE,
      sellerId: sellerId,
      createdAt: fixedDate.toISOString(),
      updatedAt: fixedDate.toISOString(),
      category: EnumCategory.ELECTRONICS,
      condition: EnumProductCondition.NEW,
    });

    const soldProduct = new Product({
      id: productId,
      title: "Test Product",
      description: "Test Description",
      price: 100,
      status: EnumProductStatus.SOLD,
      sellerId: sellerId,
      createdAt: fixedDate.toISOString(),
      updatedAt: fixedDate.toISOString(),
      category: EnumCategory.ELECTRONICS,
      condition: EnumProductCondition.NEW,
      likeCount: 0,
    });

    const completedOrderData = {
      id: "order-123",
      productId: productId,
      buyerId: "buyer-123",
      sellerId: sellerId,
      finalPrice: 100,
      status: EnumOrderStatus.CREATED,
      createdAt: fixedDate,
      paidAt: undefined,
      completedAt: undefined,
    };

    // Mock the repository methods
    productRepository.findById.mockResolvedValue(oldProduct);
    orderRepository.save.mockResolvedValue(new Order(completedOrderData));
    productRepository.update.mockResolvedValue(soldProduct);

    // Execute the use case
    const result = await useCase.execute("buyer-123", productId);

    // Assertions
    expect(productRepository.findById).toHaveBeenCalledWith(new ProductId(productId));
    expect(orderRepository.save).toHaveBeenCalledWith(expect.any(Order));
    expect(productRepository.update).toHaveBeenCalledWith(new ProductId(productId), soldProduct);
    expect(completedOrderData).toStrictEqual(result);
  });

  it("should throw NotFoundException when user is not found", async () => {
    // User ID and Product ID for the test
    const userId = new UserId("nonexistent-user");
    const productId = "product-123";

    // Create an instance of Product with the necessary properties
    const productResponse = new Product({
      id: productId,
      title: "Test Product",
      description: "Test Description",
      price: 100,
      status: EnumProductStatus.AVAILABLE,
      sellerId: userId.getValue(),
      createdAt: fixedDate.toISOString(),
      updatedAt: fixedDate.toISOString(),
      category: EnumCategory.ELECTRONICS,
      condition: EnumProductCondition.NEW,
    });

    // Mock the repository methods to simulate not finding the product
    productRepository.findById.mockResolvedValue(undefined);
    productRepository.update.mockResolvedValue(productResponse);

    // Execute the use case and expect it to throw NotFoundException
    await expect(useCase.execute("user-123", productId)).rejects.toThrow(NotFoundException);
    expect(productRepository.findById).toHaveBeenCalledWith(new ProductId(productId));
    expect(productRepository.update).not.toHaveBeenCalled();
  });

  it("should throw Error when completing order fails", async () => {
    // User ID and Product ID for the test
    const buyerId = "buyer-123";
    const productId = new ProductId("product-456");

    // Create an instance of Product with the necessary properties
    const oldProduct = new Product({
      id: productId.getValue(),
      title: "Test Product",
      description: "Test Description",
      price: 100,
      status: EnumProductStatus.AVAILABLE,
      sellerId: "seller-123",
      createdAt: fixedDate.toISOString(),
      updatedAt: fixedDate.toISOString(),
      category: EnumCategory.ELECTRONICS,
      condition: EnumProductCondition.NEW,
    });

    // Mock the repository methods
    productRepository.findById.mockResolvedValue(oldProduct);

    // Simulate an error when trying to update the product
    productRepository.update.mockRejectedValue(new Error("Failed to complete order"));

    productRepository.update.mockImplementation(() => {
      throw new Error("Failed to complete order");
    });

    // Execute the use case and expect it to throw an error
    await expect(useCase.execute(buyerId, "product-456")).rejects.toThrow("Failed to create order");
    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(productRepository.update).not.toHaveBeenCalledWith(
      new ProductId("product-456"),
      oldProduct,
    );
  });
});
