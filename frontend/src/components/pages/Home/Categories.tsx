import Image from "next/image";

// TODO : image
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
    image: "/assets/images/categories/health-beauty.png",
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

export function Categories() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:flex lg:grid-cols-8 gap-2 justify-between">
      {categories.map((cat) => (
        <a key={cat.name} href={cat.link} className="flex flex-col items-center transition">
          <div className="flex items-center justify-center w-20 h-20 sm:w-22 sm:h-22 md:w-26 md:h-26 rounded-full mb-3 overflow-hidden bg-gray-200 hover:bg-gray-300 transition duration-300">
            <Image
              src={cat.image}
              alt={cat.name}
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <span className="text-sm sm:text-base text-center">{cat.name}</span>
        </a>
      ))}
    </div>
  );
}
