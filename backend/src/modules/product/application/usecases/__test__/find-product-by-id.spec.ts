import { Test } from "@nestjs/testing";
import { Product } from "../../../../product/domain/product.entity";
import {
  EnumCategory,
  EnumProductCondition,
  EnumProductStatus,
  ProductId,
} from "../../../../product/domain/product.value-object";
import { IProductRepository } from "../../../../product/repositories/product.repository.interfaces";
import { FindProductByIdUseCase } from "../find-product-by-id";

describe("FindProductByIdUseCase", () => {
  let useCase: FindProductByIdUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");
  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // Mock the repository
    const productRepositoryMock = {
      findById: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindProductByIdUseCase,
        {
          provide: "IProductRepository",
          useValue: productRepositoryMock,
        },
      ],
    }).compile();

    // Get the use case and repository from the module
    useCase = moduleRef.get<FindProductByIdUseCase>(FindProductByIdUseCase);
    productRepository = moduleRef.get("IProductRepository") as jest.Mocked<IProductRepository>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully find a product", async () => {
    // Product ID for the test
    const productId = new ProductId("product-123");

    // Create an instance of Product with the necessary properties
    const productResponse = {
      id: "product-123",
      title: "Test Product",
      description: "This is a test product.",
      price: 100,
      status: EnumProductStatus.AVAILABLE,
      category: EnumCategory.ELECTRONICS,
      condition: EnumProductCondition.NEW,
      images: [
        {
          imageId: "image-123",
          url: "http://example.com/image.jpg",
          order: 1,
          format: "jpg",
        },
      ],
      sellerId: "user-123",
      likeCount: 0,
      createdAt: fixedDate.toISOString(),
      updatedAt: fixedDate.toISOString(),
    };

    productRepository.findById.mockImplementation((_: ProductId) => {
      return Promise.resolve(new Product(productResponse));
    });

    // Execute the use case
    const result = await useCase.execute("product-123");

    // Assertions
    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(result).toStrictEqual(productResponse);
  });

  it("should throw Error when creating product fails", async () => {
    // Product ID for the test
    const productId = new ProductId("product-123");

    // Simulate a failure in the repository
    productRepository.findById.mockRejectedValue(new Error("Not Found Product"));
    productRepository.findById.mockImplementation(() => {
      throw new Error("Not Found Product");
    });

    // Execute the use case and expect an error
    await expect(useCase.execute("product-123")).rejects.toThrow("Not Found Product");
    expect(productRepository.findById).toHaveBeenCalledWith(productId);
  });
});
