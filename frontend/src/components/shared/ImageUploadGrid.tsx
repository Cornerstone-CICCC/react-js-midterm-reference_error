import { useState } from "react";
import { useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { HiOutlineCamera } from "react-icons/hi";

type FormData = {
  title: string;
  description: string;
  price: string;
  currency: string;
  categoryId: string;
  subCategoryId: string;
  condition: string;
  images: { url: string; order: number }[];
};

type Props = {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
};

export function ImageUploadedGrid({ formData, setFormData }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
    setIsDragging(true);
  };
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const uploadImage = (index: number) => {
    inputRefs.current[index]?.click();
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleImageChange = (index: number, file: File) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = {
      ...updatedImages[index],
      url: URL.createObjectURL(file), // Use blob URL for preview
    };
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    const fileType = e.dataTransfer.files[0].name.split(".")[1];
    if (fileType !== "jpeg" && fileType !== "png") {
      return alert("Image must be jpeg or jpg");
    }
    handleImageChange(index, file);
  };
  return (
    <div className="grid grid-cols-4  sm:grid-rows-1 grid-rows-2 gap-2">
      {formData.images.map((image, index) => (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          onClick={() => uploadImage(index)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          key={image.order}
          className={`aspect-square border rounded-md flex items-center justify-center bg-gray-50 relative cursor-pointer ${
            index === 0 ? "col-span-2 row-span-2 sm:col-span-1" : "col-span-1"
          } ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        >
          {index === 0 && (
            <div className="absolute top-1 left-1 text-gray-600 bg-white text-xs px-1 rounded">
              Thumbnail
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/jpg, image/jpeg, image/png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageChange(index, file);
            }}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
          />
          {image.url ? (
            <img
              src={image.url}
              alt={`Preview ${index}`}
              className="object-cover w-full h-full rounded-md"
            />
          ) : (
            <HiOutlineCamera className="w-6 h-6 text-gray-400" />
          )}
        </div>
      ))}
    </div>
  );
}
