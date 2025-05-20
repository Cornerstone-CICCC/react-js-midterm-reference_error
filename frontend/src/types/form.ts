import type { FormData } from "./formData";

export type ValidationError = {
  title?: string;
  description?: string;
  price?: string;
  currency?: string;
  categoryId?: string;
  condition?: string;
  images?: string;
  submit?: string;
};

export function ValidateProductForm(data: FormData): ValidationError {
  const errors: ValidationError = {};

  if (!data.title.trim()) {
    errors.title = "Please enter a product name";
  }

  if (!data.description.trim()) {
    errors.description = "Please enter a product description";
  }

  if (!data.price || Number.parseFloat(data.price) <= 0) {
    errors.price = "Please enter a valid price";
  }

  if (!data.currency) {
    errors.currency = "Please select a currency";
  }

  if (!data.categoryId) {
    errors.categoryId = "Please select a category";
  }

  if (!data.condition) {
    errors.condition = "Please select product condition";
  }

  // Image validation
  const hasImages = data.images.some((image) => image.url.trim() !== "");
  if (!hasImages) {
    errors.images = "Please upload at least one image";
  }

  return errors;
}
