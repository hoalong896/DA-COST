"use client";
import { Search, ShoppingCart, User, Bell, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [role, setRole] = useState(null);
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/home2/search?query=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-purple-300 shadow-md relative">
      {/* Logo */}
      <Link
        href="/home2"
        className="flex items-center space-x-2 cursor-pointer"
      >
        <Image src="/logo.png" alt="OBG Logo" width={100} height={50} />
      </Link>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex-1 mx-6 flex items-center max-w-md"
      >
        <input
          type="text"
          placeholder="Search..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 px-3 py-1 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
        />
        <button
          type="submit"
          className="bg-green-400 px-3 py-1 rounded-r-md hover:bg-green-500"
        >
          <Search size={18} />
        </button>
      </form>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Nút thông báo */}
        <button className="flex items-center space-x-1 bg-yellow-200 px-3 py-2 rounded-md hover:bg-yellow-300">
          <Bell size={20} />
          <span>Thông báo</span>
        </button>

        {/* Giỏ hàng */}
        <Link
          href="/home2/shop-cart"
          className="flex items-center space-x-1 bg-pink-300 px-3 py-2 rounded-md hover:bg-pink-400"
        >
          <ShoppingCart size={20} />
          <span>Giỏ hàng</span>
        </Link>

        {/* Nếu là người bán thì hiện "Gian hàng của tôi" */}
        {role === "NGUOI_BAN" && (
          <Link
            href="/seller/my-shop"
            className="flex items-center space-x-1 bg-blue-300 px-3 py-2 rounded-md hover:bg-blue-400"
          >
            <Store size={20} />
            <span>Gian hàng của tôi</span>
          </Link>
        )}

        {/* Tài khoản */}
        <Link
          href="/profile"
          className="flex items-center space-x-1 bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300"
        >
          <User size={20} />
          <span>Tài khoản</span>
        </Link>
      </div>
    </header>
  );
}
