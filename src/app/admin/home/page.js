"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Package,
  ShoppingCart,
  LogOut,
  BarChart3,
  Boxes,
} from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      router.push("/dangnhap");
      return;
    }

    if (role !== "Admin") {
      alert("Bạn không có quyền truy cập trang này!");
      router.push("/home2");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          router.push("/dangnhap");
        }
      } catch (err) {
        console.error("Lỗi khi tải user:", err);
        router.push("/dangnhap");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/dangnhap");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8 text-center">⚙ Admin Panel</h2>
        <button
          onClick={() => router.push("/admin/users")}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700"
        >
          <Users size={20} /> Quản lý người dùng
        </button>
        <button
          onClick={() => router.push("/admin/action/product")}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700"
        >
          <Package size={20} /> Quản lý sản phẩm
        </button>
        <button
          onClick={() => router.push("/admin/orders")}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700"
        >
          <ShoppingCart size={20} /> Quản lý đơn hàng
        </button>
        <button
          onClick={() => router.push("/admin/orders")}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700"
        >
          <Boxes size={20} /> Quản lý danh mục
        </button>
        <button
          onClick={() => router.push("/admin/orders")}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700"
        >
          <BarChart3 size={20} /> Thống kê
        </button>
        <button
          onClick={() => router.push("/admin/action/report")}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700"
        >
          <BarChart3 size={20} /> báo cáo
        </button>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 w-full"
          >
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Chào mừng trở lại, {user?.ho_ten}
          </h1>
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full border"
            />
            <span className="font-medium">{user?.email}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md">
            <p className="text-gray-500">Tổng người dùng</p>
            <h2 className="text-2xl font-bold text-blue-600">1,250</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md">
            <p className="text-gray-500">Sản phẩm đang bán</p>
            <h2 className="text-2xl font-bold text-green-600">320</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md">
            <p className="text-gray-500">Đơn hàng tháng này</p>
            <h2 className="text-2xl font-bold text-purple-600">89</h2>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push("/admin/users")}
            className="p-6 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600"
          >
            Quản lý người dùng
          </button>
          <button
            onClick={() => router.push("/admin/action/product")}
            className="p-6 bg-green-500 text-white rounded-xl shadow hover:bg-green-600"
          >
            Quản lý sản phẩm
          </button>
          <button
            onClick={() => router.push("/admin/action/product")}
            className="p-6 bg-purple-500 text-white rounded-xl shadow hover:bg-purple-600"
          >
            Quản lý đơn hàng
          </button>
          <button
            onClick={() => router.push("/admin/action/categories")}
            className="p-6 bg-purple-500 text-white rounded-xl shadow hover:bg-purple-600"
          >
            Quản lý danh mục
          </button>
          <button
            onClick={() => router.push("/admin/action/product")}
            className="p-6 bg-purple-500 text-white rounded-xl shadow hover:bg-purple-600"
          >
            Thống kê
          </button>
        </div>
      </div>
    </div>
  );
}
