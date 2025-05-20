import { Test } from "@nestjs/testing";
import { Product } from "../../../../product/domain/product.entity";
import {
  EnumCategory,
  EnumProductCondition,
  EnumProductStatus,
} from "../../../../product/domain/product.value-object";
import { IProductRepository } from "../../../../product/repositories/product.repository.interfaces";
import { ReadProductUseCase } from "../read-products";

describe("ReadProductUseCase", () => {
  let useCase: ReadProductUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");
  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // Mock the repository
    const productRepositoryMock = {
      read: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReadProductUseCase,
        {
          provide: "IProductRepository",
          useValue: productRepositoryMock,
        },
      ],
    }).compile();

    // Get the use case and repository from the module
    useCase = moduleRef.get<ReadProductUseCase>(ReadProductUseCase);
    productRepository = moduleRef.get("IProductRepository") as jest.Mocked<IProductRepository>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully read products", async () => {
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

    productRepository.read.mockImplementation(() => {
      return Promise.resolve([new Product(productResponse)]);
    });

    // Execute the use case
    const result = await useCase.execute();

    // Assertions
    expect(productRepository.read).toHaveBeenCalledWith();
    expect(result).toStrictEqual([productResponse]);
  });

  it("should throw Error when reading products fails", async () => {
    // Simulate an error in the repository
    productRepository.read.mockRejectedValue(new Error("Not Found Product"));
    productRepository.read.mockImplementation(() => {
      throw new Error("Not Found Product");
    });

    // Execute the use case and expect an error
    await expect(useCase.execute()).rejects.toThrow("Not Found Product");
    expect(productRepository.read).toHaveBeenCalledWith();
  });
});
