import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "../../auth/presentation/current-user.decorators";
import { CreateProductUseCase } from "../application/usecases/create-product";
import { DeleteProductUseCase } from "../application/usecases/delete-product";
import { FindProductByIdUseCase } from "../application/usecases/find-product-by-id";
import { FindProductByCategoryUseCase } from "../application/usecases/find-products-by-category";
import { ReadProductUseCase } from "../application/usecases/read-products";
import { UpdateProductUseCase } from "../application/usecases/update-product";
import { CreateProductInput, ProductResponseDto, UpdateProductInput } from "./product.dto";

@Resolver("Product")
export class ProductResolver {
  constructor(
    private readonly createProductUsecase: CreateProductUseCase,
    private readonly deleteProductUsecase: DeleteProductUseCase,
    private readonly findProductByIdUsecase: FindProductByIdUseCase,
    private readonly updateProductUsecase: UpdateProductUseCase,
    private readonly findProductByCategoryUsecase: FindProductByCategoryUseCase,
    private readonly readProductsUsecase: ReadProductUseCase,
  ) {}

  @Mutation(() => ProductResponseDto)
  //   @UseGuards(JwtAuthGuard)
  async createProduct(
    @CurrentUser() userId: string,
    @Args("input") input: CreateProductInput,
  ): Promise<ProductResponseDto> {
    // TODO: 一時的なユーザーID
    // ここでは、ユーザーIDをハードコーディングしていますが、実際のアプリケーションでは認証されたユーザーのIDを使用する必要があります。
    const effectiveUserId =
      process.env.NODE_ENV === "test" ? userId : "e75e9165-2b6b-4d33-adbd-2eb5aac39ea5";
    return await this.createProductUsecase.execute(effectiveUserId, input);
  }

  @Mutation(() => ProductResponseDto)
  //   @UseGuards(JwtAuthGuard)
  async updateProduct(
    @CurrentUser() userId: string,
    @Args("id") id: string,
    @Args("input") input: UpdateProductInput,
  ): Promise<ProductResponseDto> {
    const effectiveUserId =
      process.env.NODE_ENV === "test" ? userId : "e75e9165-2b6b-4d33-adbd-2eb5aac39ea5";

    return await this.updateProductUsecase.execute(effectiveUserId, id, input);
  }

  @Mutation(() => ProductResponseDto)
  //   @UseGuards(JwtAuthGuard)
  async deleteProduct(@Args("id") id: string): Promise<ProductResponseDto> {
    return await this.deleteProductUsecase.execute(id);
  }

  @Query(() => ProductResponseDto)
  async findProductById(@Args("id") id: string): Promise<ProductResponseDto> {
    return await this.findProductByIdUsecase.execute(id);
  }

  @Query(() => [ProductResponseDto])
  async findProductsByCategory(@Args("category") category: string): Promise<ProductResponseDto[]> {
    return await this.findProductByCategoryUsecase.execute(category);
  }

  @Query(() => [ProductResponseDto])
  async readProducts(): Promise<ProductResponseDto[]> {
    return await this.readProductsUsecase.execute();
  }
}
