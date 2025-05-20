import { Categories } from "@/components/pages/Home/Categories";
import { Banner } from "@/components/shared/Banner";
import { ProductItems } from "@/components/shared/ProductItems";
import { SectionLayout } from "@/components/shared/SectionLayout";

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fff] font-sans md:pb-0">
      <Banner />
      <main className="max-w-6xl mx-auto px-4">
        <SectionLayout title="Categories">
          <Categories />
        </SectionLayout>
        {/* Featured items section */}
        <SectionLayout title="Featured Items">
          <ProductItems />
        </SectionLayout>

        {/* dummy upload product section */}
        {/* <SectionLayout title="Upload Product">
          <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Upload Your Product</h2>
            <p className="text-gray-600 mb-4">Share your products with the world!</p>
            <ImageUploader productId="9dbb2eab-0c0d-4977-9949-1742a6063c88" />
          </div>
        </SectionLayout> */}
      </main>
    </div>
  );
}
