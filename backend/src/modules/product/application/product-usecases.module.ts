import { Module } from "@nestjs/common";
import { UserRepositoryModule } from "../../user/repositories/user.repository.module";
import { ProductRepositoryModule } from "../repositories/product.repository.module";
import { CreateProductUseCase } from "./usecases/create-product";
import { DeleteProductUseCase } from "./usecases/delete-product";
import { FindProductByIdUseCase } from "./usecases/find-product-by-id";
import { FindProductByCategoryUseCase } from "./usecases/find-products-by-category";
import { ReadProductUseCase } from "./usecases/read-products";
import { UpdateProductUseCase } from "./usecases/update-product";

@Module({
  imports: [ProductRepositoryModule, UserRepositoryModule],
  providers: [
    ReadProductUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    FindProductByIdUseCase,
    FindProductByCategoryUseCase,
    DeleteProductUseCase,
  ],
  exports: [
    ReadProductUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    FindProductByIdUseCase,
    FindProductByCategoryUseCase,
    DeleteProductUseCase,
  ],
})
export class ProductUseCases {}
