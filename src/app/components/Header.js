"use client";
import Image from "next/image";
import { ShoppingCart, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/home2/search?query=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-sky-200 shadow-md relative">
      {/* Logo */}
      <div className="flex items-center space-x-2 cursor-pointer">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-500 font-bold text-xl">
          OBG
        </div>
        <span className="ml-2 text-green font-bold text-2xl hover:text-orange-300 transition-colors">
          Shop
        </span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center w-1/2">
        <input
          type="text"
          placeholder="Search..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full px-4 py-2 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          className="bg-white px-4 py-2 rounded-r-lg hover:bg-gray-100"
        >
          <Search size={20} />
        </button>
      </form>

      {/* Actions */}
      <div className="flex items-center space-x-4 text-black font-semibold">
        <Link href="/dangky">
          <button className="hover:underline">Register</button>
        </Link>
        <Link href="/dangnhap">
          <button className="hover:underline">Login</button>
        </Link>
        <Link href="/home2/shop-cart">
          <button className="flex items-center space-x-1 bg-pink-500 px-3 py-2 rounded-lg">
            <ShoppingCart size={20} />
          </button>
        </Link>
      </div>
    </header>
  );
}
