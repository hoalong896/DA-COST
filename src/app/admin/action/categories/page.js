"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CategoryTable from "@/app/components/CategoryTable";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  // lấy danh mục
  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // thêm cha
  const handleAddParent = async () => {
    const name = prompt("Nhập tên danh mục cha:");
    if (!name) return;

    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ten_danh_muc: name }),
    });

    fetchCategories();
  };

  // thêm con
  const handleAdd = async (parentId) => {
    const name = prompt("Nhập tên danh mục con:");
    if (!name) return;

    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ten_danh_muc: name, parent_id: parentId }),
    });

    fetchCategories();
  };

  // xóa
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (res.ok) {
      alert("Xóa thành công!");
      fetchCategories();
    } else {
      alert(data.error || "Xóa thất bại!");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-black">Quản lý danh mục</h1>
        <button
          onClick={() => router.push("/admin/home")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          <ArrowLeft size={18} /> Thoát
        </button>
      </div>

      <CategoryTable
        categories={categories}
        handleAdd={handleAdd}
        handleDelete={handleDelete}
        handleAddParent={handleAddParent}
      />
    </div>
  );
}
