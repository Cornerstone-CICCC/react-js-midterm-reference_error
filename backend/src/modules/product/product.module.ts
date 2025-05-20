import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ProductUseCases } from "./application/product-usecases.module";
import { ProductResolver } from "./presentation/product.resolver";
import { ProductRepository } from "./repositories/product.repository";
import { ProductRepositoryModule } from "./repositories/product.repository.module";

@Module({
  imports: [ProductUseCases, ProductRepositoryModule],
  providers: [
    ProductResolver,
    PrismaService,
    {
      provide: "IProductRepository",
      useClass: ProductRepository,
    },
  ],
  exports: [ProductResolver, "IProductRepository"],
})
export class ProductModule {}
