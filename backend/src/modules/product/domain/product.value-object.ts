export class ProductId {
  private readonly value: string | undefined;

  constructor(id: string | null | undefined) {
    if (id === undefined || id === null) {
      this.value = undefined;
      return;
    }

    if (!this.isValid(id)) {
      throw new Error("Invalid product ID format");
    }
    this.value = id;
  }

  private isValid(id: string): boolean {
    return /^[a-zA-Z0-9-]{8,}$/.test(id);
  }

  getValue(): string | undefined {
    return this.value;
  }
}

export class Money {
  private readonly value: number;

  constructor(value: number) {
    if (!this.isValid(value)) {
      throw new Error("Invalid money value");
    }
    this.value = value;
  }

  private isValid(value: number): boolean {
    return value >= 0;
  }

  getValue(): number {
    return this.value;
  }
}

export class ProductStatus {
  private readonly value: EnumProductStatus;

  constructor(status?: EnumProductStatus) {
    // statusが未定義またはnullの場合、デフォルト値としてAVAILABLEを使用
    if (status === undefined || status === null) {
      this.value = EnumProductStatus.AVAILABLE;
      return;
    }

    // 指定されたステータスが有効かチェック
    if (!this.isValid(status)) {
      throw new Error("Invalid product status");
    }

    this.value = status;
  }

  private isValid(status: string): boolean {
    const validStatuses = Object.values(EnumProductStatus);
    return validStatuses.includes(status as EnumProductStatus);
  }

  getValue(): EnumProductStatus {
    return this.value;
  }
}

export class Category {
  private readonly value: EnumCategory;

  constructor(category: EnumCategory) {
    if (!this.isValid(category)) {
      throw new Error(`Invalid category: ${category}`);
    }
    this.value = category;
  }

  private isValid(category: string): boolean {
    const validCategories = Object.values(EnumCategory);
    const result = validCategories.includes(category as EnumCategory);
    return result;
  }

  getValue(): EnumCategory {
    return this.value;
  }
}

export class ProductCondition {
  private readonly value: EnumProductCondition | undefined;

  constructor(condition: EnumProductCondition | undefined) {
    if (!this.isValid(condition)) {
      throw new Error("Invalid product condition");
    }
    this.value = condition;
  }

  private isValid(condition: string | undefined): boolean {
    if (condition === undefined) {
      return true;
    }

    const validConditions = Object.values(EnumProductCondition);
    return validConditions.includes(condition as EnumProductCondition);
  }

  getValue(): EnumProductCondition | undefined {
    return this.value;
  }
}

export enum EnumProductStatus {
  AVAILABLE = "available",
  SOLD = "sold",
  CANCELLED = "cancelled",
}

export enum EnumProductCondition {
  NEW = "new",
  LIKE_NEW = "like_new",
  GOOD = "good",
  FAIR = "fair",
  POOR = "poor",
}

export enum EnumCategory {
  ELECTRONICS = "electronics",
  WOMAN_FASHION = "woman_fashion",
  MAN_FASHION = "man_fashion",
  FURNITURE = "furniture",
  HEALTH_BEAUTY = "health_beauty",
  KITCHEN = "kitchen",
  BOOKS = "books",
  SPORTS = "sports",
}
