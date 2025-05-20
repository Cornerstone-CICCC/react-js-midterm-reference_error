import { ImageUploadedGrid } from "@/components/shared/ImageUploadGrid";
import { CharacterCounter } from "@/components/ui/CharacterCounter";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { FormActions } from "@/components/ui/FormActions";
import { PriceInput } from "@/components/ui/PriceInput";
import { SelectInput } from "@/components/ui/SelectInput";
import { TextArea } from "@/components/ui/TextArea";
import { TextInput } from "@/components/ui/TextInput";
import type { ValidationError } from "@/types/form";
import { ValidateProductForm } from "@/types/form";
import type { FormData } from "@/types/formData";
import { useState } from "react";

const categories = [
  {
    name: "Electronics",
    image: "/assets/images/categories/electronics.png",
    link: "/categories/electronics",
  },
  {
    name: "Women's Fashion",
    image: "/assets/images/categories/women-s-fashion.png",
    link: "/categories/women-fashion",
  },
  {
    name: "Men's Fashion",
    image: "/assets/images/categories/men-s-fashion.png",
    link: "/categories/men-fashion",
  },
  {
    name: "Furniture",
    image: "/assets/images/categories/furniture.png",
    link: "/categories/furniture",
  },
  {
    name: "Health & Beauty",
    image: "/assets/images/categories/health--beauty.png",
    link: "/categories/health-beauty",
  },
  {
    name: "Kitchen",
    image: "/assets/images/categories/kitchen.png",
    link: "/categories/kitchen",
  },
  {
    name: "Sports & Outdoors",
    image: "/assets/images/categories/sports-outdoors.png",
    link: "/categories/sports-outdoors",
  },
  {
    name: "Books & Media",
    image: "/assets/images/categories/books-media.png",
    link: "/categories/books-media",
  },
];

const conditionOptions = [
  { label: "New", value: "NEW" },
  { label: "Like New", value: "LIKE_NEW" },
  { label: "Good", value: "GOOD" },
  { label: "Fair", value: "FAIR" },
  { label: "Poor", value: "POOR" },
];

const currencyOptions = [
  { label: "Canadian Dollar", value: "CAD" },
  { label: "US Dollar", value: "USD" },
];

export function ProductCreatePage() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "15",
    currency: "CAD",
    categoryId: "",
    subCategoryId: "",
    condition: "good",
    images: [
      { url: "", order: 0 },
      { url: "", order: 1 },
      { url: "", order: 2 },
      { url: "", order: 3 },
    ],
  });

  const [errors, setErrors] = useState<ValidationError>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 入力時にエラーをクリア
    if (errors[name as keyof ValidationError]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    const validationErrors = ValidateProductForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  };

  const handleSaveDraft = () => {
    // TODO: 下書き保存機能の実装
  };

  return (
    <div className="max-w-3xl mx-auto px-4 w-full">
      <div className="pb-4 pt-6">
        <h1 className="text-xl font-bold">Create New Listing</h1>
      </div>

      <form onSubmit={handleSubmit} className="py-4">
        <div className="flex flex-col gap-4">
          {/* Image Upload Section */}
          <div>
            <ImageUploadedGrid formData={formData} setFormData={setFormData} />
            {errors.images && <ErrorMessage message={errors.images} />}
          </div>

          {/* Product Name */}
          <div>
            <TextInput
              label="Title"
              name="title"
              value={formData.title}
              maxLength={40}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
              error={errors.title}
            />
            <CharacterCounter current={formData.title.length} max={40} />
          </div>

          {/* Product Description */}
          <div>
            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              maxLength={1000}
              onChange={handleInputChange}
              placeholder="Describe your product in detail including condition, features, etc."
              required
              error={errors.description}
            />
            <CharacterCounter current={formData.description.length} max={1000} />
          </div>

          {/* Category */}
          <SelectInput
            label="Category"
            name="categoryId"
            value={formData.categoryId}
            options={categories.map((cat) => ({ label: cat.name, value: cat.name }))}
            onChange={handleInputChange}
            required
            error={errors.categoryId}
          />

          {/* Condition */}
          <SelectInput
            label="Condition"
            name="condition"
            value={formData.condition}
            options={conditionOptions}
            onChange={handleInputChange}
            required
            error={errors.condition}
          />

          {/* Price */}
          <PriceInput
            value={formData.price}
            onChange={handleInputChange}
            required
            error={errors.price}
          />

          {/* Currency */}
          <SelectInput
            label="Currency"
            name="currency"
            value={formData.currency}
            options={currencyOptions}
            onChange={handleInputChange}
            required
            error={errors.currency}
          />
        </div>

        {errors.submit && <ErrorMessage message={errors.submit} />}

        <FormActions onSaveDraft={handleSaveDraft} onSubmit={handleSubmit} />
      </form>
    </div>
  );
}
