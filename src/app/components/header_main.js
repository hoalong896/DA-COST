"use client";
import { Search, ShoppingCart, User } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-purple-300 shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <a href="/home2">
          {" "}
          <Image src="/logo.png" alt="OBG Logo" width={50} height={50} />
        </a>
      </div>

      {/* Search bar */}
      <div className="flex-1 mx-6 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button className="bg-green-400 px-3 py-2 rounded-r-md hover:bg-green-500">
          <Search size={20} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <a
          href="/cart"
          className="flex items-center space-x-1 bg-pink-300 px-3 py-2 rounded-md hover:bg-pink-400"
        >
          <ShoppingCart size={20} />
          <span>Giỏ hàng</span>
        </a>
        <a
          href="/account"
          className="flex items-center space-x-1 bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300"
        >
          <User size={20} />
          <span>Tài khoản</span>
        </a>
      </div>
    </header>
  );
}
