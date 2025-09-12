"use client";

import { useState } from "react";
import Header from "../components/Header";
import DanhMuc from "../components/danhmuc";
import DanhSach from "../components/danhsach";
import Footer from "../components/Footer";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Header */}
      <Header />

      {/* Nội dung chính (chiếm không gian còn lại) */}
      <main className="flex-1">
        {/* Truyền onSelect xuống DanhMuc */}
        <DanhMuc
          selected={selectedCategory}
          onSelect={(id) => setSelectedCategory(id)}
        />

        {/* Truyền selectedCategory xuống DanhSach */}
        <DanhSach category={selectedCategory} />
      </main>

      {/* Footer luôn nằm cuối */}
      <Footer />
    </div>
  );
}
