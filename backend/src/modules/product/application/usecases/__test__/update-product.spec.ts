import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserId } from "../../../..//user/domain/user.value-objects";
import { IUserRepository } from "../../../..//user/repositories/user.repository.interface";
import { Product } from "../../../../product/domain/product.entity";
import {
  EnumCategory,
  EnumProductCondition,
  EnumProductStatus,
  ProductId,
} from "../../../../product/domain/product.value-object";
import { IProductRepository } from "../../../../product/repositories/product.repository.interfaces";
import { User } from "../../../../user/domain/user.entities";
import { UpdateProductUseCase } from "../update-product";

describe("UpdateProductUseCase", () => {
  let useCase: UpdateProductUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let productRepository: jest.Mocked<IProductRepository>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");
  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // Mock the repositories
    const productRepositoryMock = {
      update: jest.fn(),
      findById: jest.fn(),
    };

    const userRepositoryMock = {
      findById: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateProductUseCase,
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
    useCase = moduleRef.get<UpdateProductUseCase>(UpdateProductUseCase);
    userRepository = moduleRef.get("IUserRepository") as jest.Mocked<IUserRepository>;
    productRepository = moduleRef.get("IProductRepository") as jest.Mocked<IProductRepository>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully update a product", async () => {
    // User ID and Product ID for the test
    const userId = new UserId("user-123");
    const productId = "product-123";

    // Create an instance of User with the necessary properties
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
      images: [
        {
          url: "http://example.com/image.jpg",
          order: 1,
          format: "jpg",
        },
      ],
      sellerId: userId.getValue(),
    };

    // Create an instance of Product for the existing product
    const oldProduct = new Product({
      id: productId,
      title: product.title,
      description: product.description,
      price: product.price,
      status: product.status,
      category: product.category,
      condition: EnumProductCondition.NEW,
      images: product.images.map((image) => ({
        imageId: "image-123",
        url: image.url,
        order: image.order,
        format: image.format,
      })),
      sellerId: userId.getValue(),
    });

    // Create a mock product response
    const productResponse = {
      id: "product-123",
      title: product.title,
      description: product.description,
      price: product.price,
      status: product.status,
      category: product.category,
      condition: EnumProductCondition.NEW,
      images: product.images.map((image) => ({
        imageId: "image-123",
        url: image.url,
        order: image.order,
        format: image.format,
      })),
      sellerId: userId.getValue(),
      likeCount: 0,
      createdAt: fixedDate.toISOString(),
      updatedAt: fixedDate.toISOString(),
    };

    // Mock the repository methods
    userRepository.findById.mockResolvedValue(user);
    productRepository.findById.mockResolvedValue(oldProduct);
    productRepository.update.mockImplementation(
      (_productId: ProductId, updatedProduct: Product) => {
        expect(updatedProduct).toBeInstanceOf(Product);

        return Promise.resolve(new Product(productResponse));
      },
    );

    // Execute the use case
    const result = await useCase.execute(userId.getValue(), productId, product);

    // Assertions
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(productRepository.findById).toHaveBeenCalledWith(new ProductId(productId));
    expect(productRepository.update).toHaveBeenCalledWith(
      new ProductId(productId),
      new Product({
        id: productId,
        title: product.title,
        description: product.description,
        price: product.price,
        status: product.status,
        category: product.category,
        condition: EnumProductCondition.NEW,
        sellerId: userId.getValue(),
        images: product.images,
        likeCount: 0,
      }),
    );
    expect(result).toStrictEqual(productResponse);
  });

  it("should throw NotFoundException when user is not found", async () => {
    // User ID and Product ID for the test
    const userId = new UserId("nonexistent-user");
    const productId = "product-123";

    // Simulate not finding the user
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

    // Execute the use case and expect it to throw NotFoundException
    await expect(useCase.execute(userId.getValue(), productId, product)).rejects.toThrow(
      new NotFoundException("User not found"),
    );
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(productRepository.findById).not.toHaveBeenCalled();
    expect(productRepository.update).not.toHaveBeenCalled();
  });

  it("should throw NotFoundException when product is not found", async () => {
    const userId = new UserId("user-123");
    const productId = "nonexistent-product";

    // Create an instance of User with the necessary properties
    const user = new User({
      id: "user-123",
      authId: "auth-123",
      email: "test@example.com",
      nickname: "testuser",
      avatarUrl: null,
      bio: null,
      isActive: true,
    });

    // Create a mock input product
    const product = {
      title: "Test Product",
      description: "This is a test product.",
      price: 100,
      status: EnumProductStatus.AVAILABLE,
      category: EnumCategory.ELECTRONICS,
      images: [
        {
          url: "http://example.com/image.jpg",
          order: 1,
          format: "jpg",
        },
      ],
      sellerId: userId.getValue(),
    };

    // Mock the repository methods
    userRepository.findById.mockResolvedValue(user); // ユーザーは存在する
    productRepository.findById.mockResolvedValue(undefined); // 商品は存在しない

    // Execute the use case and expect it to throw NotFoundException
    await expect(useCase.execute(userId.getValue(), productId, product)).rejects.toThrow(
      new NotFoundException("Product not found"),
    );

    // Assertions
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(productRepository.findById).toHaveBeenCalledWith(new ProductId(productId));
    expect(productRepository.update).not.toHaveBeenCalled(); // 商品が見つからないので更新は呼ばれない
  });

  it("should throw Error when update product fails", async () => {
    // User ID and Product ID for the test
    const userId = new UserId("user-456");
    const productId = "product-123";

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

    // Create a mock input product
    const product = {
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

    // Create an instance of Product for the existing product
    const existingProduct = new Product({
      id: productId,
      title: "Original Product",
      description: "This is the original product.",
      price: 50,
      status: EnumProductStatus.AVAILABLE,
      category: EnumCategory.ELECTRONICS,
      images: [],
      sellerId: userId.getValue(),
      likeCount: 0,
      createdAt: new Date().toISOString(),
    });

    // Mock the repository methods
    productRepository.findById.mockResolvedValue(existingProduct);

    // Simulate an error when trying to update the product
    productRepository.update.mockRejectedValue(new Error("Failed to update product"));

    // Execute the use case and expect it to throw an error
    await expect(useCase.execute(userId.getValue(), productId, product)).rejects.toThrow(
      "Failed to update product",
    );

    // Assertions
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(productRepository.findById).toHaveBeenCalledWith(new ProductId(productId));
    expect(productRepository.update).toHaveBeenCalledWith(
      new ProductId(productId),
      expect.any(Product),
    );
  });
});
