"use client";
import React from "react";
import { Trash2, Plus } from "lucide-react";

export default function CategoryTable({
  categories,
  handleAdd,
  handleDelete,
  handleAddParent,
}) {
  // Hàm render 1 dòng danh mục
  const renderCategoryRow = (cat, level = 0) => (
    <tr
      key={cat.ma_danh_muc}
      className={`border-b ${
        level === 0
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-gray-700 hover:bg-gray-600"
      }`}
    >
      {/* Cột ID */}
      <td className="px-4 py-3 text-gray-300">{cat.ma_danh_muc}</td>

      {/* Cột tên danh mục */}
      <td
        className={`px-4 py-3 ${
          level === 0
            ? "font-bold text-lg text-white"
            : "pl-8 text-gray-200 text-sm"
        }`}
      >
        {level > 0 && "↳ "}
        {cat.ten_danh_muc}
      </td>

      {/* Cột hành động */}
      <td className="px-4 py-3 flex gap-2">
        {level === 0 && (
          <button
            onClick={() => handleAdd(cat.ma_danh_muc)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Thêm con
          </button>
        )}
        <button
          onClick={() => handleDelete(cat.ma_danh_muc)}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
        >
          <Trash2 size={16} /> Xóa
        </button>
      </td>
    </tr>
  );

  // Hàm render đệ quy cha-con
  const renderCategoryTree = (cats, level = 0) =>
    cats.map((cat) => (
      <React.Fragment key={cat.ma_danh_muc}>
        {renderCategoryRow(cat, level)}
        {cat.children && renderCategoryTree(cat.children, level + 1)}
      </React.Fragment>
    ));

  return (
    <div className="w-full">
      {/* Nút thêm danh mục cha */}
      <div className="flex justify-end mb-3">
        <button
          onClick={handleAddParent}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} /> Thêm danh mục cha
        </button>
      </div>

      {/* Bảng danh mục */}
      <table className="min-w-full text-left text-sm rounded overflow-hidden">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Tên danh mục</th>
            <th className="px-4 py-3">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            renderCategoryTree(categories)
          ) : (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-6 text-center text-gray-400 bg-gray-800"
              >
                Chưa có danh mục nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
