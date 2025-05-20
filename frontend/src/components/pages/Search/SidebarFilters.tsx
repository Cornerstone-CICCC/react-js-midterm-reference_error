import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { CustomRadio } from "@/components/ui/CustomRadio";

type SidebarFiltersProps = {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (price: string) => void;
  onMaxPriceChange: (price: string) => void;
  selectedConditions: string[];
  onConditionToggle: (condition: string) => void;
  isMobile?: boolean;
};

const categories = [
  "Electronics",
  "Women's Fashion",
  "Men's Fashion",
  "Furniture",
  "Health & Beauty",
  "Kitchen",
  "Sports & Outdoors",
  "Books & Media",
];
const locations = ["Vancouver", "Surrey", "Burnaby", "Richmond"];
const conditions = ["New", "Used - Like New", "Used - Good", "Used - Fair"];

export function SidebarFilters({
  selectedCategories,
  onCategoryToggle,
  selectedLocation,
  onLocationChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  selectedConditions,
  onConditionToggle,
  isMobile,
}: SidebarFiltersProps) {
  return (
    <aside
      className={`w-64 space-y-6 p-4 bg-white text-sm ${isMobile ? "w-full p-2 text-base" : ""}`}
    >
      {/* Category */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Category</h3>
        <div className="flex flex-col gap-1 md:gap-2">
          {categories.map((category) => (
            <CustomCheckbox
              key={category}
              checked={selectedCategories.includes(category)}
              onChange={() => onCategoryToggle(category)}
              label={category}
              className={isMobile ? "text-lg" : ""}
            />
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Location</h3>
        <div className="flex flex-col gap-1 md:gap-2">
          {locations.map((loc) => (
            <CustomRadio
              key={loc}
              checked={selectedLocation === loc}
              onChange={() => onLocationChange(loc)}
              label={loc}
              name="location"
              value={loc}
              className={isMobile ? "text-lg" : ""}
            />
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Price</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="w-1/2 border-2 border-gray-400 rounded px-2 py-1 focus:border-orange-500 outline-none placeholder-gray-300"
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-1/2 border-2 border-gray-400 rounded px-2 py-1 focus:border-orange-500 outline-none placeholder-gray-300"
          />
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Condition</h3>
        <div className="flex flex-col gap-1 md:gap-2">
          {conditions.map((cond) => (
            <CustomCheckbox
              key={cond}
              checked={selectedConditions.includes(cond)}
              onChange={() => onConditionToggle(cond)}
              label={cond}
              className={isMobile ? "text-lg" : ""}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
