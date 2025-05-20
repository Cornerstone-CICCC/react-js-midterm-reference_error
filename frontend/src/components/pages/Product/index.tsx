"use client";

import { ProductDetails } from "@/components/pages/Product/ProductDetails";
import { ProductSlide } from "@/components/pages/Product/ProductSlide";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProductItems } from "@/components/shared/ProductItems";
import type { Product } from "@/types/Product";
import { getProductById } from "@/usecases/product";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    window.scrollTo(0, 0);

    getProductById(id as string)
      .then((result) => {
        if (result?.success && result.product) {
          setProduct(result.product);
        } else {
          console.error("Failed to fetch product data");
        }
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

  if (!product) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Breadcrumbs
        title={product.title}
        category={product.category}
        subCategory={product.subCategory}
      />
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
        {/* Container for ItemSlide with position context */}
        <div className="w-full md:sticky md:top-0 md:self-start">
          <ProductSlide images={product.images} title={product.title} breakpoint={980} />
        </div>

        {/* item details - this will scroll normally */}
        <div className="w-full">
          <ProductDetails product={product} />
        </div>
      </div>
      <section className="my-10">
        <h2 className="text-xl font-bold mt-6 mb-4">Related Items</h2>
        <ProductItems />
      </section>
    </div>
  );
}
