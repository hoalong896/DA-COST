"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function DanhMuc({ selected, onSelect }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(null); // chỉ mở 1 menu cha

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (res.ok) setCategories(data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg">
      {/* Nút tất cả */}
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          selected === null
            ? "bg-orange-600 text-white"
            : "bg-white text-gray-800 hover:bg-gray-200"
        }`}
      >
        Tất cả
      </button>

      {/* Danh mục cha + con */}
      {categories.map((dm) => (
        <div key={dm.ma_danh_muc} className="relative group">
          {/* Cha */}
          <button
            onClick={() =>
              setOpen(open === dm.ma_danh_muc ? null : dm.ma_danh_muc)
            }
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1 transition-all ${
              selected === dm.ma_danh_muc
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-200"
            }`}
          >
            {dm.ten_danh_muc}
            {dm.children?.length > 0 && <ChevronDown size={16} />}
          </button>

          {/* Con (dropdown) */}
          {dm.children?.length > 0 && open === dm.ma_danh_muc && (
            <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg flex flex-col z-10">
              {dm.children.map((child) => (
                <button
                  key={child.ma_danh_muc}
                  onClick={() => onSelect(child.ma_danh_muc)}
                  className={`px-4 py-2 text-left whitespace-nowrap rounded-lg transition-all ${
                    selected === child.ma_danh_muc
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {child.ten_danh_muc}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
