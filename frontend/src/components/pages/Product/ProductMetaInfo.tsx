import type { ProductCondition } from "@/types/Product";
import { HiChevronRight } from "react-icons/hi";

export function ProductMetaInfo({
  condition,
  category,
  subCategory,
}: {
  condition: ProductCondition;
  category: string;
  subCategory?: string;
}) {
  return (
    <div className="mb-6 space-y-2">
      <div className="flex items-center">
        <span className="font-semibold">Condition:</span>
        <span className="ml-2">{condition ? condition.replace("_", " ") : "Unknown"}</span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold">Category:</span>
        <span className="ml-2 flex items-center">
          <a href={`/category/${category}`} className="hover:underline">
            {category}
          </a>
          {subCategory && (
            <>
              <HiChevronRight className="mx-1" />
              <a href={`/category/${category}/${subCategory}`} className="hover:underline">
                {subCategory}
              </a>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
