import type { Product } from "@/types/Product";

interface ProductListProps {
  products: Product[];
  emptyMessage: string;
}

export function ProductList({ products, emptyMessage }: ProductListProps) {
  if (products.length === 0) {
    return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="space-y-1 md:space-y-2">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center space-x-3 sm:space-x-4 bg-gray-50 rounded-lg p-1 sm:p-2 hover:bg-gray-100 transition-colors"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
            <img
              src={product.images[0]?.url || "/placeholder.png"}
              alt={product.title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-medium text-base sm:text-lg mb-1 truncate">{product.title}</h3>
            <p className="text-gray-600 font-medium">
              {product.price} {"CAD"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
