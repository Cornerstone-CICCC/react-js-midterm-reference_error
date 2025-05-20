import { UserId } from "../../user/domain/user.value-objects";
import {
  Category,
  EnumCategory,
  EnumProductCondition,
  EnumProductStatus,
  Money,
  ProductCondition,
  ProductId,
  ProductStatus,
} from "./product.value-object";

export class ProductImage {
  private readonly _imageId?: string;
  private readonly _url: string;
  private readonly _order: number;
  private readonly _format: string;

  constructor(props: {
    imageId?: string;
    url: string;
    order: number;
    format: string;
  }) {
    this._imageId = props.imageId;
    this._url = props.url;
    this._order = props.order;
    this._format = props.format;
  }

  get imageId(): string | undefined {
    return this._imageId;
  }
  get url(): string {
    return this._url;
  }
  get order(): number {
    return this._order;
  }
  get format(): string {
    return this._format;
  }

  // プレーンオブジェクトに変換
  toPlain() {
    const result: {
      imageId?: string;
      url: string;
      order: number;
      format: string;
    } = {
      url: this._url,
      order: this._order,
      format: this._format,
    };

    if (this._imageId) {
      result.imageId = this._imageId;
    }

    return result;
  }
}

// 更新用の入力型定義
export interface ProductUpdateProps {
  title?: string;
  description?: string;
  price?: number;
  status?: EnumProductStatus;
  category?: EnumCategory;
  condition?: EnumProductCondition | null;
  images?: {
    imageId?: string;
    url: string;
    order: number;
    format: string;
  }[];
}

// Productエンティティの修正
export class Product {
  private readonly _id?: ProductId;
  private readonly _sellerId: UserId;
  private _title: string;
  private _description: string;
  private _price: Money;
  private _status: ProductStatus;
  private _category: Category;
  private _condition: ProductCondition | undefined;
  private _images: ProductImage[]; // 値オブジェクトの配列
  private _likeCount: number;
  private _createdAt: string;
  private _updatedAt: string;

  constructor(props: {
    id?: string | null;
    sellerId: string;
    title: string;
    description: string;
    price: number;
    status?: EnumProductStatus;
    category: EnumCategory;
    condition?: EnumProductCondition;
    images?: {
      imageId?: string;
      url: string;
      order: number;
      format: string;
    }[];
    likeCount?: number;
    createdAt?: string;
    updatedAt?: string;
  }) {
    this._id = props.id ? new ProductId(props.id) : undefined;
    this._sellerId = new UserId(props.sellerId);
    this._title = props.title;
    this._description = props.description;
    this._price = new Money(props.price);
    this._status = new ProductStatus(props.status);
    this._category = new Category(props.category);
    this._condition = props.condition ? new ProductCondition(props.condition) : undefined;

    this._images = (props.images || []).map((img) => new ProductImage(img));

    this._likeCount = props.likeCount || 0;
    this._createdAt = props.createdAt
      ? new Date(props.createdAt).toISOString()
      : new Date().toISOString();
    this._updatedAt = props.updatedAt
      ? new Date(props.updatedAt).toISOString()
      : new Date().toISOString();
  }

  // ゲッターはそのまま

  get id(): ProductId | undefined {
    return this._id;
  }

  get sellerId(): UserId {
    return this._sellerId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get price(): Money {
    return this._price;
  }

  get status(): ProductStatus {
    return this._status;
  }

  get category(): Category {
    return this._category;
  }

  get condition(): ProductCondition | undefined {
    return this._condition;
  }

  get images(): ProductImage[] {
    return [...this._images];
  }

  get likeCount(): number {
    return this._likeCount;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  // 画像追加
  addImage(imageData: {
    url: string;
    order: number;
    format: string;
  }): void {
    if (!imageData.url || !imageData.order || !imageData.format) {
      throw new Error("Invalid image data");
    }

    if (this._images.length >= 10) {
      throw new Error("Maximum number of images reached");
    }

    // 値オブジェクトを作成して追加
    this._images.push(new ProductImage(imageData));
  }

  // リポジトリ用のプレーンオブジェクト取得
  getImagesForRepository() {
    return this._images.map((img) => img.toPlain());
  }

  // 画像削除
  removeImage(imageToRemove: ProductImage): void {
    this._images = this._images.filter(
      (img) =>
        img.url !== imageToRemove.url ||
        img.order !== imageToRemove.order ||
        img.format !== imageToRemove.format,
    );
  }

  // ID指定で画像削除
  removeImageById(imageId: string | undefined): void {
    if (!imageId) return;
    this._images = this._images.filter((img) => img.imageId !== imageId);
  }

  update(updateProps: Partial<ProductUpdateProps>): Product {
    // 現在の状態をコピーする基本オブジェクトを作成
    const updatedProps = {
      id: this._id?.getValue(),
      sellerId: this._sellerId.getValue(),
      title: this._title,
      description: this._description,
      price: this._price.getValue(),
      status: this._status.getValue(),
      category: this._category.getValue(),
      condition: this._condition?.getValue(),
      images: this.getImagesForRepository(),
      likeCount: this._likeCount,
      createdAt: this._createdAt,
    };

    // 更新するプロパティを適用
    if (updateProps.title !== undefined) {
      updatedProps.title = updateProps.title;
    }

    if (updateProps.description !== undefined) {
      updatedProps.description = updateProps.description;
    }

    if (updateProps.price !== undefined) {
      updatedProps.price = updateProps.price;
    }

    if (updateProps.status !== undefined) {
      updatedProps.status = updateProps.status;
    }

    if (updateProps.category !== undefined) {
      updatedProps.category = updateProps.category;
    }

    // condition は null の場合も考慮（削除する場合）
    if (updateProps.condition !== undefined) {
      updatedProps.condition = updateProps.condition || undefined;
    }

    // 画像の更新（指定があれば完全に置き換え）
    if (updateProps.images !== undefined) {
      updatedProps.images = updateProps.images;
    }

    // 新しいProductインスタンスを作成して返す
    return new Product(updatedProps);
  }

  soldProduct(): void {
    this._status = new ProductStatus(EnumProductStatus.SOLD);
  }
}
