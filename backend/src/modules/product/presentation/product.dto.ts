import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Product } from "../domain/product.entity";
import {
  EnumCategory,
  EnumProductCondition,
  EnumProductStatus,
} from "../domain/product.value-object";

@InputType()
export class CreateProductInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  category: EnumCategory;

  @Field({ nullable: true })
  condition?: EnumProductCondition;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  status?: EnumProductStatus;

  @Field({ nullable: true })
  category?: EnumCategory;

  @Field({ nullable: true })
  condition?: EnumProductCondition;

  @Field(() => [ImageInput], { nullable: true })
  images?: ImageInput[];
}

@ObjectType()
export class ProductResponseDto {
  @Field()
  id: string;

  @Field()
  sellerId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  status: string;

  @Field()
  category: EnumCategory;

  @Field({ nullable: true })
  condition?: string;

  @Field(() => [ImageResponseDto])
  images: ImageResponseDto[] | [];

  @Field()
  likeCount: number;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@InputType()
export class ImageInput {
  @Field()
  url: string;

  @Field()
  order: number;

  @Field()
  format: string;
}

@ObjectType()
export class ImageResponseDto {
  @Field()
  imageId: string;

  @Field()
  url: string;

  @Field()
  order: number;

  @Field()
  format: string;
}

export const mapToProductPrimitive = (product: Product): ProductResponseDto => {
  return {
    id: product.id?.getValue() ?? "",
    sellerId: product.sellerId.getValue(),
    title: product.title,
    description: product.description,
    price: product.price.getValue(),
    status: product.status.getValue(),
    category: product.category.getValue(),
    condition: product.condition?.getValue(),
    images: product.images.map((image) => ({
      imageId: image.imageId ? image.imageId : "",
      url: image.url,
      order: image.order,
      format: image.format,
    })),
    likeCount: product.likeCount,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};
