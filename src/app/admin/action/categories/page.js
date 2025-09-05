"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories/get_categories");
      if (!res.ok) throw new Error("Không lấy được dữ liệu");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    const ten = prompt("Nhập tên danh mục mới:");
    if (!ten) return;

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ten_danh_muc: ten, mo_ta: "" }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Thêm danh mục thành công!");
      fetchCategories(); // reload danh sách ngay sau khi thêm
    } else {
      alert(data.error || "Thêm thất bại!");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Quản lý danh mục</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft size={18} /> Quay về
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} /> Thêm danh mục
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-4 text-gray-400">Đang tải...</p>
        ) : (
          <table className="w-full text-left text-white">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tên danh mục</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.ma_danh_muc}
                  className="border-b border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="px-4 py-3">{cat.ma_danh_muc}</td>
                  <td className="px-4 py-3">{cat.ten_danh_muc}</td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    Chưa có danh mục nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
