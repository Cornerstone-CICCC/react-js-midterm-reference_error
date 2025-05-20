import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserId } from "../../../..//user/domain/user.value-objects";
import { IUserRepository } from "../../../..//user/repositories/user.repository.interface";
import { Product } from "../../../../product/domain/product.entity";
import {
  EnumCategory,
  EnumProductCondition,
  EnumProductStatus,
} from "../../../../product/domain/product.value-object";
import { IProductRepository } from "../../../../product/repositories/product.repository.interfaces";
import { User } from "../../../../user/domain/user.entities";
import { CreateProductUseCase } from "../create-product";

describe("CreateProductUseCase", () => {
  let useCase: CreateProductUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let productRepository: jest.Mocked<IProductRepository>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");
  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // Mock the repositories
    const productRepositoryMock = {
      create: jest.fn(),
    };

    const userRepositoryMock = {
      findById: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: "IProductRepository",
          useValue: productRepositoryMock,
        },
        {
          provide: "IUserRepository",
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    // Get the use case and repository from the module
    useCase = moduleRef.get<CreateProductUseCase>(CreateProductUseCase);
    userRepository = moduleRef.get("IUserRepository") as jest.Mocked<IUserRepository>;
    productRepository = moduleRef.get("IProductRepository") as jest.Mocked<IProductRepository>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully create a product", async () => {
    // User ID for the test
    const userId = new UserId("user-123");

    const user = new User({
      id: "user-123",
      authId: "auth-123",
      email: "test@example.com",
      nickname: "testuser",
      avatarUrl: null,
      bio: null,
      isActive: true,
    });

    // Create an instance of Product with the necessary properties
    const product = {
      title: "Test Product",
      description: "This is a test product.",
      price: 100,
      status: EnumProductStatus.AVAILABLE,
      category: EnumCategory.ELECTRONICS,
      sellerId: userId.getValue(),
    };

    // Create a mock product response
    const productResponse = {
      id: "product-123",
      title: product.title,
      description: product.description,
      price: product.price,
      status: product.status,
      category: product.category,
      condition: EnumProductCondition.NEW,
      sellerId: userId.getValue(),
      likeCount: 0,
      images: [],
      createdAt: fixedDate.toISOString(),
      updatedAt: fixedDate.toISOString(),
    };

    // Mock the repository methods
    userRepository.findById.mockResolvedValue(user);

    productRepository.create.mockImplementation((_: UserId, updatedProduct: Product) => {
      // Assert that the product is created with the correct parameters
      expect(updatedProduct).toBeInstanceOf(Product);

      return Promise.resolve(new Product(productResponse));
    });

    // Execution
    const result = await useCase.execute(userId.getValue(), product);

    // Assertion
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(productRepository.create).toHaveBeenCalledWith(
      userId,
      new Product({
        title: product.title,
        description: product.description,
        price: product.price,
        status: product.status,
        category: product.category,
        sellerId: userId.getValue(),
        likeCount: 0,
      }),
    );
    expect(result).toStrictEqual(productResponse);
  });

  it("should throw NotFoundException when user is not found", async () => {
    // User ID for the test
    const userId = new UserId("nonexistent-user");

    // Mock the repository methods to simulate not finding the user
    userRepository.findById.mockResolvedValue(null);

    const product = {
      id: "product-123",
      title: "Test Product",
      description: "This is a test product.",
      price: 100,
      status: EnumProductStatus.AVAILABLE,
      category: EnumCategory.ELECTRONICS,
      images: [
        {
          imageId: "image-123",
          url: "http://example.com/image.jpg",
          order: 1,
          format: "jpg",
        },
      ],
      sellerId: userId.getValue(),
    };

    // Execute the use case and Assertions
    await expect(useCase.execute(userId.getValue(), product)).rejects.toThrow(NotFoundException);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  it("should throw Error when creating product fails", async () => {
    // User ID for the test
    const userId = new UserId("user-456");

    // Create an instance of User with the necessary properties
    const user = new User({
      id: "user-456",
      authId: "auth-456",
      email: "test2@example.com",
      nickname: "testuser2",
      avatarUrl: null,
      bio: null,
      isActive: true,
    });

    // Mock the repository methods
    userRepository.findById.mockResolvedValue(user);

    const product = {
      id: "product-123",
      title: "Test Product",
      description: "This is a test product.",
      price: 100,
      status: EnumProductStatus.AVAILABLE,
      category: EnumCategory.ELECTRONICS,
      images: [
        {
          imageId: "image-123",
          url: "http://example.com/image.jpg",
          order: 1,
          format: "jpg",
        },
      ],
      sellerId: userId.getValue(),
    };

    // Simulate an error when trying to create the product
    productRepository.create.mockRejectedValue(new Error("Failed to create product"));

    productRepository.create.mockImplementation(() => {
      throw new Error("Failed to create product");
    });

    // Execute the use case and Assertions
    await expect(useCase.execute(userId.getValue(), product)).rejects.toThrow(
      "Failed to create product",
    );
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(productRepository.create).toHaveBeenCalledWith(userId, expect.any(Product));
  });
});
