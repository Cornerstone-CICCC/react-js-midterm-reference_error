"use client";
import type { Product } from "@/types/Product";
import { getProducts } from "@/usecases/product";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ProductItems() {
  const [data, setData] = useState<Product[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getProducts();
      if (result?.success && result.products) {
        setData(result.products);
      }
    };
    fetchData();
  }, []);
  if (!data) {
    return <div className="text-center text-gray-500">No products available</div>;
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-6 content-start">
      {data.map((item) => (
        <Link key={item.id} href={`/item/${item.id}`}>
          <div className="bg-white flex flex-col group cursor-pointer">
            <div className="w-full aspect-square rounded-lg  bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={
                  item.images[0]?.url
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${item.images[0].url}`
                    : "/assets/images/no-image.png"
                }
                alt={item.title}
                className="w-full h-auto object-cover transition-all duration-300 ease-in-out transform group-hover:scale-105 group-hover:brightness-75"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between p-2">
              <p className="text-sm font-medium truncate mb-1 text-gray-800">{item.title}</p>
              <p className="text-sm font-bold">
                {item.price} CAD
                {/*TODO: USD or CAD  */}
                {/* {item.price.currency} */}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
