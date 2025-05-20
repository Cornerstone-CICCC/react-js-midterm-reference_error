import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { ProductRepository } from "./product.repository";

@Module({
  providers: [
    PrismaService,
    ProductRepository,
    {
      provide: "IProductRepository",
      useClass: ProductRepository,
    },
  ],
  exports: [PrismaService, ProductRepository, "IProductRepository"],
})
export class ProductRepositoryModule {}
