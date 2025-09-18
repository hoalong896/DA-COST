"use client";

import { useState } from "react";
import Header from "../components/Header";
import DanhMuc from "../components/danhmuc";
import DanhSach from "../components/danhsach";
import Footer from "../components/Footer";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5fbff] text-gray-900">
      <Header />

      <main className="flex-1">
        <DanhMuc
          selected={selectedCategory}
          onSelect={(id) => setSelectedCategory(id)}
        />
        <DanhSach category={selectedCategory} />
      </main>
      <Footer />
    </div>
  );
}
