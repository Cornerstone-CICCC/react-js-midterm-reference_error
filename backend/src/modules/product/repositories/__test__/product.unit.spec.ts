// モックするPrismaオブジェクトとその型
const mockPrismaProduct = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock("../../../../prisma/prisma.service", () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => {
      return {
        product: mockPrismaProduct,
      };
    }),
  };
});

import * as path from "node:path";
import * as dotenv from "dotenv";

const envPath = path.resolve(__dirname, "../../../../.env.test");
dotenv.config({ path: envPath });

import { Test } from "@nestjs/testing";
import { PrismaService } from "../../../../prisma/prisma.service";
import { UserId } from "../../../user/domain/user.value-objects";
import { Product } from "../../domain/product.entity";
import {
  Category,
  EnumCategory,
  EnumProductCondition,
  EnumProductStatus,
  ProductId,
} from "../../domain/product.value-object";
import { ProductRepository } from "../product.repository";

describe("ProductRepository", () => {
  let repository: ProductRepository;

  beforeEach(async () => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [ProductRepository, PrismaService],
    }).compile();

    repository = moduleRef.get<ProductRepository>(ProductRepository);
  });

  // テスト用のデータを作成
  const mockProductData = {
    id: "product-123",
    sellerId: "user-456",
    title: "Test Product",
    description: "This is a test product.",
    price: 100,
    status: EnumProductStatus.AVAILABLE,
    category: EnumCategory.ELECTRONICS,
    condition: EnumProductCondition.NEW,
    likeCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: "image-123",
        url: "http://example.com/image.jpg",
        order: 1,
        format: "jpg",
        productId: "product-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  describe("read", () => {
    it("should return an array of products", async () => {
      // モックの戻り値を設定
      mockPrismaProduct.findMany.mockResolvedValue([mockProductData]);

      // メソッドを実行
      const result = await repository.read();

      // 検証
      expect(mockPrismaProduct.findMany).toHaveBeenCalledWith({
        include: { images: true },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Product);
      expect(result[0]?.id?.getValue()).toBe("product-123");
      expect(result[0].title).toBe("Test Product");
    });

    it("should return empty array when no products are found", async () => {
      // モックの戻り値を設定
      mockPrismaProduct.findMany.mockResolvedValue([]);

      // メソッドを実行
      const result = await repository.read();

      // 検証
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
  });

  describe("findByCategory", () => {
    it("should return products filtered by category", async () => {
      // モックの戻り値を設定
      mockPrismaProduct.findMany.mockResolvedValue([mockProductData]);

      // カテゴリーを作成
      const category = new Category(EnumCategory.ELECTRONICS);

      // メソッドを実行
      const result = await repository.findByCategory(category);

      // 検証
      expect(mockPrismaProduct.findMany).toHaveBeenCalledWith({
        where: { category: category.getValue() },
        include: { images: true },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Product);
      expect(result[0].category.getValue()).toBe(EnumCategory.ELECTRONICS);
    });
  });

  describe("findById", () => {
    it("should return a product by id", async () => {
      // モックの戻り値を設定
      mockPrismaProduct.findUnique.mockResolvedValue(mockProductData);

      // ProductIdを作成
      const productId = new ProductId("product-123");

      // メソッドを実行
      const result = await repository.findById(productId);

      // 検証
      expect(mockPrismaProduct.findUnique).toHaveBeenCalledWith({
        where: { id: "product-123" },
        include: { images: true },
      });
      expect(result).toBeInstanceOf(Product);
      expect(result?.id?.getValue()).toBe("product-123");
    });

    it("should return undefined when product is not found", async () => {
      // モックの戻り値を設定
      mockPrismaProduct.findUnique.mockResolvedValue(null);

      // ProductIdを作成
      const productId = new ProductId("nonexistent-product");

      // メソッドを実行
      const result = await repository.findById(productId);

      // 検証
      expect(result).toBeUndefined();
    });
  });

  describe("create", () => {
    it("should create a new product", async () => {
      // モックの戻り値を設定
      mockPrismaProduct.create.mockResolvedValue(mockProductData);

      // ユーザーIDを作成
      const sellerId = new UserId("user-456");

      // 新しい商品を作成
      const newProduct = new Product({
        sellerId: "user-456",
        title: "New Product",
        description: "This is a new product.",
        price: 200,
        status: EnumProductStatus.AVAILABLE,
        category: EnumCategory.ELECTRONICS,
        condition: EnumProductCondition.NEW,
        images: [
          {
            url: "http://example.com/new-image.jpg",
            order: 1,
            format: "jpg",
          },
        ],
      });

      // メソッドを実行
      const result = await repository.create(sellerId, newProduct);

      // 検証
      expect(mockPrismaProduct.create).toHaveBeenCalledWith({
        data: {
          sellerId: "user-456",
          title: "New Product",
          description: "This is a new product.",
          price: 200,
          category: EnumCategory.ELECTRONICS,
          condition: EnumProductCondition.NEW,
          images: {
            create: [
              {
                imageId: undefined, // 新規のため未定義
                url: "http://example.com/new-image.jpg",
                order: 1,
                format: "jpg",
              },
            ],
          },
        },
        include: {
          images: true,
        },
      });
      expect(result).toBeInstanceOf(Product);
      expect(result?.id?.getValue()).toBe("product-123"); // モックの返り値から
      expect(result.title).toBe("Test Product"); // モックの返り値から
    });
  });

  describe("update", () => {
    it("should update an existing product", async () => {
      // モックの戻り値を設定
      mockPrismaProduct.update.mockResolvedValue(mockProductData);

      // ProductIdを作成
      const productId = new ProductId("product-123");

      // 更新する商品を作成
      const updatedProduct = new Product({
        id: "product-123",
        sellerId: "user-456",
        title: "Updated Product",
        description: "This is an updated product.",
        price: 150,
        status: EnumProductStatus.AVAILABLE,
        category: EnumCategory.ELECTRONICS,
        condition: EnumProductCondition.GOOD,
        images: [
          {
            imageId: "image-456",
            url: "http://example.com/updated-image.jpg",
            order: 1,
            format: "jpg",
          },
        ],
      });

      // メソッドを実行
      const result = await repository.update(productId, updatedProduct);

      // 検証
      expect(mockPrismaProduct.update).toHaveBeenCalledWith({
        where: { id: "product-123" },
        data: {
          title: "Updated Product",
          description: "This is an updated product.",
          price: 150,
          status: EnumProductStatus.AVAILABLE,
          category: EnumCategory.ELECTRONICS,
          condition: EnumProductCondition.GOOD,
          images: {
            deleteMany: {},
            create: [
              {
                url: "http://example.com/updated-image.jpg",
                order: 1,
                format: "jpg",
              },
            ],
          },
        },
        include: {
          images: true,
        },
      });
      expect(result).toBeInstanceOf(Product);
      expect(result?.id?.getValue()).toBe("product-123");
    });
  });

  describe("delete", () => {
    it("should delete a product by id", async () => {
      // モックの戻り値を設定
      mockPrismaProduct.delete.mockResolvedValue(mockProductData);

      // ProductIdを作成
      const productId = new ProductId("product-123");

      // メソッドを実行
      const result = await repository.delete(productId);

      // 検証
      expect(mockPrismaProduct.delete).toHaveBeenCalledWith({
        where: { id: "product-123" },
        include: { images: true },
      });
      expect(result).toBeInstanceOf(Product);
      expect(result?.id?.getValue()).toBe("product-123");
    });

    it("should return null when product is not found", async () => {
      // モックの戻り値を設定
      mockPrismaProduct.delete.mockResolvedValue(null);

      // ProductIdを作成
      const productId = new ProductId("nonexistent-product");

      // メソッドを実行
      const result = await repository.delete(productId);

      // 検証
      expect(result).toBeNull();
    });
  });
});
