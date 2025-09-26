"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Store, User, Package, BarChart2 } from "lucide-react";

export default function SellerHomePage() {
  const [sellerInfo, setSellerInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/seller/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Không thể lấy dữ liệu");
        const data = await res.json();
        setSellerInfo(data.seller);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  if (!sellerInfo) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {/* Sidebar */}
      <aside className="w-72 bg-yellow-700 text-white flex flex-col p-6 space-y-6 shadow-2xl">
        {/* Logo shop */}
        <div className="bg-yellow-600 rounded-2xl p-6 text-center shadow-lg">
          <Store size={30} className="mx-auto mb-3" />
          <h1 className="text-2xl font-bold">{sellerInfo.ten_cua_hang}</h1>
          <p className="text-sm text-yellow-200">Xin chào  {sellerInfo.ho_ten}</p>
        </div>

        {/* Menu */}
        <nav className="flex flex-col space-y-2">
          <Link
            href="/seller/home"
            className="flex items-center space-x-3 p-3 rounded-xl bg-yellow-500 shadow-lg"
          >
             <span>Trang chủ</span>
          </Link>
           <Link
            href="/seller/my-shop/add"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-yellow-600 transition"
          >
              <span>Dang ban san pham </span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-yellow-600 transition"
          >
            <span>Thông tin cá nhân</span>
          </Link>
          <Link
            href="/seller/my-shop"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-yellow-600 transition"
          >
             <span>Quản lý sản phẩm</span>
          </Link>
          <Link
            href="/seller/stats"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-yellow-600 transition"
          >
            <span>Thống kê</span>
          </Link>
           
           <Link
           href="/home2"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-yellow-600 transition"
          >
            <span>Mua hang</span>
          </Link>
            <Link
           href="/seller/message"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-yellow-600 transition"
          >
            <span>cau hoi</span>
          </Link>
        </nav>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border"
        >
          <h2 className="text-2xl font-bold text-yellow-700 flex items-center space-x-2">
            <Store size={22} /> <span>{sellerInfo.ten_cua_hang}</span>
          </h2>
          <p className="text-gray-600 mt-2">
            Welcome
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-yellow-100 p-6 rounded-xl shadow text-center"
          >
            <p className="text-3xl font-extrabold text-yellow-700">12</p>
            <p className="text-gray-600">Sản phẩm</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-100 p-6 rounded-xl shadow text-center"
          >
            <p className="text-3xl font-extrabold text-green-                                                                                                                      w700">8</p>
            <p className="text-gray-600">Đơn hàng</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-blue-100 p-6 rounded-xl shadow text-center"
          >
            <p className="text-3xl font-extrabold text-blue-700">15,000,000 đ</p>
            <p className="text-gray-600">Doanh thu</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
