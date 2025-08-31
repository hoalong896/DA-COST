import Image from "next/image";
import { ShoppingCart, Search } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-300 to-purple-500 p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image src="/logo.png" alt="OBG Logo" width={50} height={50} />
      </div>

      {/* Search */}
      <div className="flex items-center w-1/2">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-l-lg border"
        />
        <button className="bg-white px-4 py-2 rounded-r-lg">
          <Search size={20} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4 text-white font-semibold">
        <a href="/dangky">
          <button className="hover:underline">Register</button>
        </a>
        <a href="../dangnhap">
          <button className="hover:underline">Login</button>
        </a>
        <a href="../dangnhap">
          <button className="flex items-center space-x-1 bg-pink-500 px-3 py-2 rounded-lg">
            <ShoppingCart size={20} />
          </button>
        </a>
      </div>
    </header>
  );
}
