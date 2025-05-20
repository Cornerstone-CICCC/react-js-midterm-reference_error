import { Test, TestingModule } from "@nestjs/testing";
import { CreateProductUseCase } from "../../application/usecases/create-product";
import { DeleteProductUseCase } from "../../application/usecases/delete-product";
import { FindProductByIdUseCase } from "../../application/usecases/find-product-by-id";
import { FindProductByCategoryUseCase } from "../../application/usecases/find-products-by-category";
import { ReadProductUseCase } from "../../application/usecases/read-products";
import { UpdateProductUseCase } from "../../application/usecases/update-product";
import {
  EnumCategory,
  EnumProductCondition,
  EnumProductStatus,
} from "../../domain/product.value-object";
import {
  CreateProductInput,
  ProductResponseDto,
  UpdateProductInput,
} from "../../presentation/product.dto";
import { ProductResolver } from "../../presentation/product.resolver";

describe("ProductResolver (Integration)", () => {
  let moduleRef: TestingModule;
  let productResolver: ProductResolver;
  let createProductUseCase: CreateProductUseCase;
  let updateProductUseCase: UpdateProductUseCase;
  let deleteProductUseCase: DeleteProductUseCase;
  let findProductByIdUseCase: FindProductByIdUseCase;
  let findProductByCategoryUseCase: FindProductByCategoryUseCase;
  let readProductsUseCase: ReadProductUseCase;

  // サンプル商品レスポンス
  const sampleProductResponse: ProductResponseDto = {
    id: "product-123",
    sellerId: "user-456",
    title: "Test Product",
    description: "This is a test product",
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
    likeCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ProductResolver,
        {
          provide: CreateProductUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateProductUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: DeleteProductUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindProductByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindProductByCategoryUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ReadProductUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    // Get the instances of the classes
    productResolver = moduleRef.get<ProductResolver>(ProductResolver);
    createProductUseCase = moduleRef.get<CreateProductUseCase>(CreateProductUseCase);
    updateProductUseCase = moduleRef.get<UpdateProductUseCase>(UpdateProductUseCase);
    deleteProductUseCase = moduleRef.get<DeleteProductUseCase>(DeleteProductUseCase);
    findProductByIdUseCase = moduleRef.get<FindProductByIdUseCase>(FindProductByIdUseCase);
    findProductByCategoryUseCase = moduleRef.get<FindProductByCategoryUseCase>(
      FindProductByCategoryUseCase,
    );
    readProductsUseCase = moduleRef.get<ReadProductUseCase>(ReadProductUseCase);
  });

  // Create Product Test
  it("should create a product and return product response", async () => {
    // Setup mock for createProductUseCase
    const createSpy = jest
      .spyOn(createProductUseCase, "execute")
      .mockResolvedValue(sampleProductResponse);

    // 商品作成用の入力データ
    const createInput: CreateProductInput = {
      title: "Test Product",
      description: "This is a test product",
      price: 100,
      category: EnumCategory.ELECTRONICS,
      condition: EnumProductCondition.NEW,
    };

    // Execute the createProduct method
    const result = await productResolver.createProduct("user-456", createInput);

    // Assert the results
    expect(createProductUseCase.execute).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledWith("user-456", createInput);
    expect(result).toEqual(sampleProductResponse);
  });

  // Update Product Test
  it("should update a product and return product response", async () => {
    // Setup mock for updateProductUseCase
    const updateSpy = jest.spyOn(updateProductUseCase, "execute").mockResolvedValue({
      ...sampleProductResponse,
      title: "Updated Product",
      price: 150,
    });

    // 商品更新用の入力データ
    const updateInput: UpdateProductInput = {
      title: "Updated Product",
      price: 150,
    };

    // Execute the updateProduct method
    const result = await productResolver.updateProduct("user-456", "product-123", updateInput);

    // Assert the results
    expect(updateProductUseCase.execute).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledWith("user-456", "product-123", updateInput);
    expect(result).toEqual({
      ...sampleProductResponse,
      title: "Updated Product",
      price: 150,
    });
  });

  // Delete Product Test
  it("should delete a product and return product response", async () => {
    // Setup mock for deleteProductUseCase
    const deleteSpy = jest
      .spyOn(deleteProductUseCase, "execute")
      .mockResolvedValue(sampleProductResponse);

    // Execute the deleteProduct method
    const result = await productResolver.deleteProduct("product-123");

    // Assert the results
    expect(deleteProductUseCase.execute).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith("product-123");
    expect(result).toEqual(sampleProductResponse);
  });

  // Find Product by ID Test
  it("should find a product by ID and return product response", async () => {
    // Setup mock for findProductByIdUseCase
    const findByIdSpy = jest
      .spyOn(findProductByIdUseCase, "execute")
      .mockResolvedValue(sampleProductResponse);

    // Execute the findProductById method
    const result = await productResolver.findProductById("product-123");

    // Assert the results
    expect(findProductByIdUseCase.execute).toHaveBeenCalled();
    expect(findByIdSpy).toHaveBeenCalledWith("product-123");
    expect(result).toEqual(sampleProductResponse);
  });

  // Find Products by Category Test
  it("should find products by category and return product responses", async () => {
    // Setup mock for findProductByCategoryUseCase
    const findByCategorySpy = jest
      .spyOn(findProductByCategoryUseCase, "execute")
      .mockResolvedValue([
        sampleProductResponse,
        {
          ...sampleProductResponse,
          id: "product-456",
          title: "Another Product",
        },
      ]);

    // Execute the findProductByCategory method
    const result = await productResolver.findProductsByCategory(EnumCategory.ELECTRONICS);

    // Assert the results
    expect(findProductByCategoryUseCase.execute).toHaveBeenCalled();
    expect(findByCategorySpy).toHaveBeenCalledWith(EnumCategory.ELECTRONICS);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(sampleProductResponse);
    expect(result[1]).toEqual({
      ...sampleProductResponse,
      id: "product-456",
      title: "Another Product",
    });
  });

  // Read Products Test
  it("should read all products and return product responses", async () => {
    // Setup mock for readProductsUseCase
    const readSpy = jest.spyOn(readProductsUseCase, "execute").mockResolvedValue([
      sampleProductResponse,
      {
        ...sampleProductResponse,
        id: "product-789",
        title: "Third Product",
      },
    ]);

    // Execute the readProducts method
    const result = await productResolver.readProducts();

    // Assert the results
    expect(readProductsUseCase.execute).toHaveBeenCalled();
    expect(readSpy).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(sampleProductResponse);
    expect(result[1]).toEqual({
      ...sampleProductResponse,
      id: "product-789",
      title: "Third Product",
    });
  });
});
