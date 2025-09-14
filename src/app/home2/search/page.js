"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch("/api/home/product");
        if (!res.ok) throw new Error("Không thể tải sản phẩm");
        const data = await res.json();

        // 🔎 Lọc sản phẩm theo từ khóa (tên + mô tả)
        const filtered = data.filter(
          (sp) =>
            sp.ten_san_pham.toLowerCase().includes(query) ||
            sp.mo_ta?.toLowerCase().includes(query)
        );

        setResults(filtered);
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchAllProducts();
    else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  // --- UI ---
  if (!query) return <p className="p-6">Hãy nhập từ khóa để tìm kiếm.</p>;
  if (loading) return <p className="p-6">Đang tìm kiếm...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Kết quả cho: "{query}"</h1>
      {results.length === 0 && <p>Không tìm thấy sản phẩm nào.</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((sp) => (
          <Link
            key={sp.ma_san_pham}
            href={`/home2/product_details/${sp.ma_san_pham}`}
            className="border p-3 rounded shadow hover:shadow-lg bg-white"
          >
            <img
              src={sp.san_pham_anh?.[0]?.url || "/placeholder.png"}
              alt={sp.ten_san_pham}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="mt-2 font-semibold">{sp.ten_san_pham}</h2>
            <p className="text-red-600">{sp.gia.toLocaleString()} VND</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
