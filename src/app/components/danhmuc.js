"use client";
import { useEffect, useState } from "react";

export default function DanhMuc({ selected, onSelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories/get_categories");
        const data = await res.json();
        if (res.ok) setCategories(data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-wrap gap-3 my-4 justify-center">
      {/* Nút tất cả */}
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          selected === null
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        Tất cả
      </button>

      {/* Các nút danh mục */}
      {categories.map((dm) => (
        <button
          key={dm.ma_danh_muc}
          onClick={() => onSelect(dm.ma_danh_muc)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selected === dm.ma_danh_muc
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {dm.ten_danh_muc}
        </button>
      ))}
    </div>
  );
}
