import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { UserId } from "../../user/domain/user.value-objects";
import { Product } from "../domain/product.entity";
import {
  Category,
  EnumCategory,
  EnumProductCondition,
  EnumProductStatus,
  ProductId,
} from "../domain/product.value-object";
import { buildWhereQuery } from "./product.build-query";
import { IProductRepository, SearchCriteria } from "./product.repository.interfaces";

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}
  async read(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: {
        images: true,
      },
    });
    if (!products) return [];
    return products.map(
      (productData) =>
        new Product({
          id: productData.id,
          sellerId: productData.sellerId,
          price: Number(productData.price),
          status: productData.status as EnumProductStatus,
          category: productData.category as EnumCategory,
          condition: productData.condition ? EnumProductCondition[productData.condition] : null,
          images: productData.images.map((image) => ({
            imageId: image.id,
            url: image.url,
            order: image.order,
            format: image.format,
          })),
          likeCount: productData.likeCount,
          createdAt: productData.createdAt.toISOString(),
          title: productData.title,
          description: productData.description,
        }),
    );
  }

  async findByCategory(category: Category): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { category: category.getValue() },
      include: {
        images: true,
      },
    });

    return products.map(
      (productData) =>
        new Product({
          id: productData.id,
          sellerId: productData.sellerId,
          price: Number(productData.price),
          status: productData.status as EnumProductStatus,
          category: productData.category as EnumCategory,
          condition: productData.condition
            ? (productData.condition as EnumProductCondition)
            : undefined,
          images: productData.images.map((image) => ({
            imageId: image.id,
            url: image.url,
            order: image.order,
            format: image.format,
          })),
          likeCount: productData.likeCount,
          createdAt: productData.createdAt.toISOString(),
          title: productData.title,
          description: productData.description,
        }),
    );
  }

  async findById(id: ProductId): Promise<Product | undefined> {
    const productId = id.getValue();
    const ProductData = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
      },
    });

    if (!ProductData) return undefined;

    // マッピングロジックをインライン化
    return new Product({
      id: ProductData.id,
      sellerId: ProductData.sellerId,
      title: ProductData.title,
      description: ProductData.description,
      price: Number(ProductData.price),
      status: ProductData.status as EnumProductStatus,
      category: ProductData.category as EnumCategory,
      condition: ProductData.condition ? EnumProductCondition[ProductData.condition] : null,
      images: ProductData.images.map((image) => ({
        imageId: image.id,
        url: image.url,
        order: image.order,
        format: image.format,
      })),
      likeCount: ProductData.likeCount,
    });
  }

  async search(criteria: SearchCriteria): Promise<Product[] | undefined> {
    const products = await this.prisma.product.findMany({
      where: await buildWhereQuery(criteria),
    });

    if (!products) return undefined;

    // マッピングロジックをインライン化
    return;
  }

  async create(sellerId: UserId, product: Product): Promise<Product> {
    // ドメインオブジェクトからPrisma形式へのマッピングもインライン化
    const responseProduct = await this.prisma.product.create({
      data: {
        sellerId: sellerId.getValue(),
        title: product.title,
        description: product.description,
        price: product.price.getValue(),
        category: product.category.getValue(),
        condition: product.condition?.getValue() ?? null,
        images: {
          create: product.images.map((image) => ({
            imageId: image.imageId,
            url: image.url,
            order: image.order,
            format: image.format,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    if (!responseProduct) {
      new Error("Failed to create product");
    }

    return new Product({
      id: responseProduct.id,
      sellerId: responseProduct.sellerId,
      title: responseProduct.title,
      description: responseProduct.description,
      price: Number(responseProduct.price),
      status: EnumProductStatus.AVAILABLE,
      category: responseProduct.category as EnumCategory,
      condition: responseProduct.condition as EnumProductCondition,
      images: responseProduct.images.map((image) => ({
        imageId: image.id,
        url: image.url,
        order: image.order,
        format: image.format,
      })),
      likeCount: responseProduct.likeCount,
      createdAt: responseProduct.createdAt.toISOString(),
    });
  }

  async update(id: ProductId, product: Product): Promise<Product> {
    const productId = id.getValue();
    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        title: product.title,
        description: product.description,
        price: product.price.getValue(),
        status: product.status.getValue(),
        category: product.category.getValue(),
        condition: product.condition?.getValue() ?? null,
        images: {
          deleteMany: {},
          create: product.images.map((image) => ({
            url: image.url,
            order: image.order,
            format: image.format,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    if (!updatedProduct) {
      new Error("Failed to update product");
    }

    return new Product({
      id: updatedProduct.id,
      sellerId: updatedProduct.sellerId,
      title: updatedProduct.title,
      description: updatedProduct.description,
      price: Number(updatedProduct.price),
      status: updatedProduct.status as EnumProductStatus,
      category: updatedProduct.category as EnumCategory,
      condition: updatedProduct.condition as EnumProductCondition,
      images: updatedProduct.images.map((image) => ({
        imageId: image.id,
        url: image.url,
        order: image.order,
        format: image.format,
      })),
      likeCount: updatedProduct.likeCount,
    });
  }

  async delete(id: ProductId): Promise<Product | null> {
    const productId = id.getValue();
    const deletedProduct = await this.prisma.product.delete({
      where: { id: productId },
      include: {
        images: true,
      },
    });

    if (!deletedProduct) return null;

    return new Product({
      id: deletedProduct.id,
      sellerId: deletedProduct.sellerId,
      title: deletedProduct.title,
      description: deletedProduct.description,
      price: Number(deletedProduct.price),
      status: deletedProduct.status as EnumProductStatus,
      category: deletedProduct.category as EnumCategory,
      condition: deletedProduct.condition ? EnumProductCondition[deletedProduct.condition] : null,
      images: deletedProduct.images.map((image) => ({
        imageId: image.id,
        url: image.url,
        order: image.order,
        format: image.format,
      })),
      likeCount: deletedProduct.likeCount,
    });
  }
}
