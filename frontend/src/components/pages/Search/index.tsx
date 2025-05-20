import { SidebarFilters } from "@/components/pages/Search/SidebarFilters";
import { ProductItems } from "@/components/shared/ProductItems";
import { demoProducts } from "@/data/demoProducts";
import type { ProductCondition } from "@/types/Product";
import { useState } from "react";
import { IoMdFunnel, IoMdSad } from "react-icons/io";
import { MobileFilterModal } from "./MobileFilterModal";

export function SearchPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // フィルター処理
  const filteredProducts = demoProducts.filter((item) => {
    // カテゴリ
    if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) return false;
    // コンディション
    if (
      selectedConditions.length > 0 &&
      !selectedConditions.includes(ConditionLabel(item.condition))
    )
      return false;
    // 金額
    if (minPrice && item.price < Number(minPrice)) return false;
    if (maxPrice && item.price > Number(maxPrice)) return false;
    // ロケーション（デモでは未実装）
    return true;
  });

  function ConditionLabel(cond: ProductCondition) {
    switch (cond) {
      case "new":
        return "New";
      case "like_new":
        return "Used - Like New";
      case "good":
        return "Used - Good";
      case "fair":
        return "Used - Fair";
      default:
        return "Other";
    }
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    );
  };

  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff] md:pb-0">
      {/* モバイル用Filterボタン */}
      <button
        className="fixed bottom-14 right-6 z-30 md:hidden text-gray-600 bg-gray-200 rounded-full px-5 py-2 text-sm flex items-center gap-2"
        onClick={() => setIsFilterOpen(true)}
      >
        <IoMdFunnel size={16} />
        <span>Filter</span>
      </button>

      {/* モバイル用モーダル（コンポーネント化） */}
      <MobileFilterModal
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onClear={() => {
          setSelectedCategories([]);
          setSelectedLocation("");
          setMinPrice("");
          setMaxPrice("");
          setSelectedConditions([]);
        }}
        onApply={() => setIsFilterOpen(false)}
      >
        <SidebarFilters
          selectedCategories={selectedCategories}
          onCategoryToggle={toggleCategory}
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          selectedConditions={selectedConditions}
          onConditionToggle={toggleCondition}
          isMobile={true}
        />
      </MobileFilterModal>

      <main className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-6 p-4">
        {/* PC用サイドバー */}
        <div className="hidden md:block w-64">
          <SidebarFilters
            selectedCategories={selectedCategories}
            onCategoryToggle={toggleCategory}
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            selectedConditions={selectedConditions}
            onConditionToggle={toggleCondition}
          />
        </div>
        <div className="p-4 flex-1 min-w-0">
          {filteredProducts.length > 0 ? (
            <ProductItems />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <IoMdSad size={48} className="mb-2" />
              <p className="mb-2">No matching items found</p>
              <button
                className="mt-2 px-4 py-2 rounded bg-orange-500 text-white font-bold hover:bg-orange-600 transition"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedLocation("");
                  setMinPrice("");
                  setMaxPrice("");
                  setSelectedConditions([]);
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
