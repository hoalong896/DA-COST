"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingCart, Eye, Zap, ArrowLeft } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query")?.toLowerCase() || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // gọi API 1 lấy danh sách sản phẩm
        const res = await fetch("/api/home/product");
        if (!res.ok) throw new Error("Không thể tải sản phẩm");
        const data = await res.json();

        // lọc theo từ khóa (frontend)
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

    if (query) fetchProducts();
    else setLoading(false);
  }, [query]);

  if (!query) return <p className="p-6">Hãy nhập từ khóa để tìm kiếm.</p>;
  if (loading) return <p className="p-6">Đang tìm kiếm...</p>;

  return (
    <div className="p-6">
      {/* nút quay lại */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
      >
        <ArrowLeft size={18} /> Quay lại
      </button>

      <h1 className="text-xl font-bold mb-4">
        Kết quả cho: "{query}" ({results.length} sản phẩm)
      </h1>

      {results.length === 0 && <p>Không tìm thấy sản phẩm nào.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((sp) => (
          <div
            key={sp.ma_san_pham}
            className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* ảnh */}
            <div className="relative w-full h-52 bg-gray-50 overflow-hidden">
              <img
                src={sp.hinh_anh || "/no-image.png"}
                alt={sp.ten_san_pham}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* nội dung */}
            <div className="p-4 flex flex-col flex-1">
              <h4 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                {sp.ten_san_pham}
              </h4>
              <p className="text-sm text-gray-500 line-clamp-2 flex-1">
                {sp.mo_ta || "Không có mô tả"}
              </p>

              <p className="text-red-600 font-extrabold text-xl mt-3">
                {sp.gia.toLocaleString()}đ
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Danh mục: {sp.ten_danh_muc || "Chưa phân loại"}
              </p>

              {/* nút */}
              <div className="flex gap-2 mt-4">
                <a
                  href={`/home2/product_details/${sp.ma_san_pham}`}
                  className="flex-1"
                >
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Eye size={16} /> Xem
                  </button>
                </a>

                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  disabled={loadingId === sp.ma_san_pham}
                  onClick={() => alert("🛒 Thêm giỏ hàng ")}
                >
                  <ShoppingCart size={16} /> Giỏ
                </button>

                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={loadingId === sp.ma_san_pham}
                  onClick={() => alert("⚡ Mua ngay (demo)")}
                >
                  <Zap size={16} /> Mua
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
