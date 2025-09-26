"use client";
import { useEffect, useState } from "react";
import { Search, ShoppingCart, User, Bell, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [role, setRole] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r);

    // 👂 Lắng nghe sự kiện từ component khác
    const handler = (e) => {
      setNotifications((prev) => [{ id: Date.now(), msg: e.detail }, ...prev]);
    };
    window.addEventListener("add-notification", handler);
    return () => window.removeEventListener("add-notification", handler);
  }, []);

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
      <form
        onSubmit={handleSearch}
        className="flex-1 mx-6 flex items-center max-w-md"
      >
        <input
          type="text"
          placeholder="Search..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="
                  w-full pl-10 pr-3 py-2 
                  border-2 border-blue-400 
                  rounded-md 
                  focus:outline-none 
                  focus:ring-4 focus:ring-blue-300 
                  text-sm
                  bg-blue-50
                  shadow-md
                  transition-all
                  duration-200
                  hover:border-blue-500
                "
        />
      </form>

      {/* Actions */}
      <div className="flex items-center space-x-4 relative">
        {/* Nút thông báo */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-1 bg-yellow-200 px-3 py-2 rounded-md hover:bg-yellow-300 relative"
          >
            <Bell size={20} />
            <span>Thông báo</span>
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-3 text-gray-500 text-sm">Không có thông báo</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 text-sm border-b last:border-0 hover:bg-gray-50"
                  >
                    {n.msg}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Giỏ hàng */}
        <Link
          href="/home2/shop-cart"
          className="flex items-center space-x-1 bg-pink-300 px-3 py-2 rounded-md hover:bg-pink-400"
        >
          <ShoppingCart size={20} />
          <span>Giỏ hàng</span>
        </Link>

        {/* Người bán */}
        {role === "NGUOI_BAN" && (
          <Link
            href="/seller/home"
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
