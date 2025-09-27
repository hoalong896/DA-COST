"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Package, BarChart2, DollarSign, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SellerStatsPage() {
  const router = useRouter();

  // Mock data (thay bằng dữ liệu từ API sau)
  const [stats] = useState({
    totalProducts: 12,
    totalOrders: 8,
    revenue: 15000000,
  });

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      {/* Nút quay lại */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 mb-6 text-yellow-700 hover:text-yellow-900"
      >
        <ArrowLeft size={20} /> <span>Quay lại</span>
      </button>

      <h1 className="text-3xl font-bold text-yellow-700 mb-8">
        Thống kê cửa hàng
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Tổng sản phẩm */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-yellow-100 p-6 rounded-xl shadow text-center"
        >
          <Package className="mx-auto mb-2 text-yellow-700" size={36} />
          <p className="text-3xl font-extrabold text-yellow-700">
            {stats.totalProducts}
          </p>
          <p className="text-gray-600">Sản phẩm</p>
        </motion.div>

        {/* Tổng đơn hàng */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-green-100 p-6 rounded-xl shadow text-center"
        >
          <BarChart2 className="mx-auto mb-2 text-green-700" size={36} />
          <p className="text-3xl font-extrabold text-green-700">
            {stats.totalOrders}
          </p>
          <p className="text-gray-600">Đơn hàng</p>
        </motion.div>

        {/* Doanh thu */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-blue-100 p-6 rounded-xl shadow text-center"
        >
          <DollarSign className="mx-auto mb-2 text-blue-700" size={36} />
          <p className="text-3xl font-extrabold text-blue-700">
            {stats.revenue.toLocaleString()} đ
          </p>
          <p className="text-gray-600">Doanh thu</p>
        </motion.div>
      </div>
    </div>
  );
}
