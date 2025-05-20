"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaPlusCircle, FaSearch, FaUser } from "react-icons/fa";

type NavButtonProps = {
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
};

export function NavButton({ icon, href, isActive = false, onClick }: NavButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center ${isActive ? "text-orange-600" : "text-gray-500"}`}
    >
      <div className="text-lg">{icon}</div>
    </Link>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full h-12 bg-white border-t border-gray-200 flex md:hidden z-20">
      <NavButton icon={<FaHome />} href="/" isActive={pathname === "/"} />
      <NavButton icon={<FaSearch />} href="/item" isActive={pathname === "/item"} />
      <NavButton icon={<FaPlusCircle />} href="/item/new" isActive={pathname === "/item/new"} />
      <NavButton icon={<FaUser />} href="/profile" isActive={pathname === "/profile"} />
    </nav>
  );
}
