"use client";
import { useEffect, useState } from "react";

export default function DanhMuc() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/danhmuc/ds_sanpham  ")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi:", err));
  }, []);

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Danh mục sản phẩm</h2>
      <ul className="flex gap-6">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="text-gray-700 hover:font-semibold cursor-pointer"
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
