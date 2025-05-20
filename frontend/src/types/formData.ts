export type FormData = {
  title: string;
  description: string;
  price: string;
  currency: string;
  categoryId: string;
  subCategoryId: string;
  condition: string;
  images: { url: string; order: number }[];
};
