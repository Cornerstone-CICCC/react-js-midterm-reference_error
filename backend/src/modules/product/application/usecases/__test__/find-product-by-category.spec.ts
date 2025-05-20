import { Test } from "@nestjs/testing";
import { Product } from "../../../../product/domain/product.entity";
import {
  Category,
  EnumCategory,
  EnumProductCondition,
  EnumProductStatus,
} from "../../../../product/domain/product.value-object";
import { IProductRepository } from "../../../../product/repositories/product.repository.interfaces";
import { FindProductByCategoryUseCase } from "../find-products-by-category";

describe("FindProductByCategoryUseCase", () => {
  let useCase: FindProductByCategoryUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  const fixedDate = new Date("2025-05-15T00:00:00.000Z");
  jest.spyOn(global, "Date").mockImplementation(() => fixedDate);

  beforeEach(async () => {
    // Mock the repository
    const productRepositoryMock = {
      findByCategory: jest.fn(),
    };

    // Set up the testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindProductByCategoryUseCase,
        {
          provide: "IProductRepository",
          useValue: productRepositoryMock,
        },
      ],
    }).compile();

    // Get the use case and repository from the module
    useCase = moduleRef.get<FindProductByCategoryUseCase>(FindProductByCategoryUseCase);
    productRepository = moduleRef.get("IProductRepository") as jest.Mocked<IProductRepository>;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully find products by category", async () => {
    // Product ID for the test
    const productCategory = EnumCategory.ELECTRONICS;

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

    productRepository.findByCategory.mockImplementation((_: Category) => {
      return Promise.resolve([new Product(productResponse)]);
    });

    // Execute the use case
    const result = await useCase.execute(productCategory);

    // Assertions
    expect(productRepository.findByCategory).toHaveBeenCalledWith(new Category(productCategory));
    expect(result).toStrictEqual([productResponse]);
  });

  it("should throw Error when finding products fails", async () => {
    // Simulate a failure in the repository method
    productRepository.findByCategory.mockRejectedValue(new Error("Not Found Product"));
    productRepository.findByCategory.mockImplementation(() => {
      throw new Error("Not Found Product");
    });

    // Execute the use case and expect an error
    await expect(useCase.execute(EnumCategory.ELECTRONICS)).rejects.toThrow("Not Found Product");
    expect(productRepository.findByCategory).toHaveBeenCalledWith(
      new Category(EnumCategory.ELECTRONICS),
    );
  });
});
