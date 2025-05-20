import { ProductDescription } from "@/components/pages/Product/ProductDescription";
import { ProductMetaInfo } from "@/components/pages/Product/ProductMetaInfo";
import { PurchaseButtonGroup } from "@/components/shared/PurchaseButtonGroup";
import type { Product } from "@/types/Product";
import { purchaseProduct } from "@/usecases/order";

export function ProductDetails({ product }: { product: Product }) {
  const handlePurchase = () => {
    purchaseProduct(product.id)
      .then((result) => {
        if (result?.success) {
          window.location.href = "/profile";
        } else {
          console.error("Purchase failed");
        }
      })
      .catch((error) => {
        console.error("Error during purchase:", error);
      });
  };
  return (
    <div className="h-full flex flex-col justify-between pb-5 md:p-2 md:pb-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">{product.title}</h1>
        <span className="text-gray-500 mb-2 block">
          boosted {new Date(product.createdAt).getHours()} hours ago
        </span>
        <span className="text-2xl font-bold my-3 md:mt-6 md:mb-4 block">${product.price}</span>
      </div>

      {/* description */}
      <ProductDescription description={product.description} />

      {/* metadata */}
      <ProductMetaInfo
        condition={product.condition}
        category={product.category}
        subCategory={product.subCategory}
      />

      {/* like and purchase button */}
      <PurchaseButtonGroup
        likeCount={product.likeCount}
        status={product.status}
        handlePurchase={handlePurchase}
      />
    </div>
  );
}
