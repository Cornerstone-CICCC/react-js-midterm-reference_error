"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  {
    name: "Electronics",
    image: "/icons/electronics.png",
    link: "/categories/electronics",
  },
  {
    name: "Women's Fashion",
    image: "/icons/women-s-fashion.png",
    link: "/categories/women-fashion",
  },
  {
    name: "Men's Fashion",
    image: "/icons/men-s-fashion.png",
    link: "/categories/men-fashion",
  },
  {
    name: "Furniture",
    image: "/icons/furniture.png",
    link: "/categories/furniture",
  },
  {
    name: "Health & Beauty",
    image: "/icons/health--beauty.png",
    link: "/categories/health-beauty",
  },
  {
    name: "Kitchen",
    image: "/icons/kitchen.png",
    link: "/categories/kitchen",
  },
  {
    name: "Sports & Outdoors",
    image: "/icons/sports-outdoors.png",
    link: "/categories/sports-outdoors",
  },
  {
    name: "Books & Media",
    image: "/icons/books-media.png",
    link: "/categories/books-media",
  },
];

type HeaderProps = {
  isSignedIn: boolean;
};

export function Header({ isSignedIn }: HeaderProps) {
  const pathname = usePathname();
  const showCategories = pathname === "/";

  return (
    <header className="w-full border-b border-gray-200 bg-white px-4 sm:px-6 pt-5 pb-0">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Top row: logo, search, button */}
        <div className="flex flew-col items-center justify-between md:gap-10 pb-4">
          {/* Logo */}
          <Link href="/">
            <span className="hidden md:block font-bold text-xl text-primary">Monogatari</span>
          </Link>

          <div className="grow flex flew-col items-center justify-between gap-3 md:gap-10">
            {/* Search input */}
            <div className="w-full">
              <input
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                placeholder="What are you looking for?"
              />
            </div>

            {/* Right section: sign in or sell button */}
            {isSignedIn ? (
              <Link href="/item/new">
                <button className="bg-orange-600 text-white px-4 py-2 rounded font-semibold text-sm whitespace-nowrap cursor-pointer hover:bg-orange-700">
                  Sell Items
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="bg-orange-600 text-white px-4 py-2 rounded font-semibold text-sm whitespace-nowrap cursor-pointer hover:bg-orange-700">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Categories row - aligned with input box */}
        {showCategories && (
          <div className="w-full">
            <div className="flex justify-start lg:justify-center items-start gap-4 lg:gap-8 overflow-x-auto text-sm pb-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.link}
                  className="whitespace-nowrap hover:underline"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
