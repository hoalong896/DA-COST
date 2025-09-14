"use client";
import { useEffect, useState } from "react";
import { ShoppingCart, Eye, Zap } from "lucide-react";

export default function DanhSach({ category }) {
  const [products, setProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null); // ✅ loading theo từng sản phẩm

  // phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "/api/home/product";
        if (category) url += `?category=${category}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
          setCurrentPage(1); // reset khi đổi category
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      }
    };
    fetchProducts();
  }, [category]);

  // thêm giỏ hàng
  // thêm giỏ hàng
  const addToCart = async (sp, redirect = false) => {
    try {
      setLoadingId(sp.ma_san_pham);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Vui lòng đăng nhập trước khi mua hàng!");
        window.location.href = "/dangnhap";
        return;
      }

      if (redirect) {
        // 👉 Lưu sản phẩm tạm cho "Mua ngay"
        const item = {
          san_pham: sp,
          so_luong: 1,
        };
        localStorage.setItem("checkoutItems", JSON.stringify([item]));
        localStorage.setItem("checkoutTotal", sp.gia);
        localStorage.setItem("checkoutMode", "buyNow"); // đánh dấu là mua ngay

        window.location.href = "/home2/shop-cart/payment";
      } else {
        // 👉 Thêm vào giỏ hàng bình thường
        const res = await fetch("/api/home/shop-cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ma_san_pham: sp.ma_san_pham, so_luong: 1 }),
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data?.message || data?.error || "Không thể thêm vào giỏ hàng"
          );

        alert("✅ Đã thêm sản phẩm vào giỏ hàng!");
      }
    } catch (err) {
      console.error("Lỗi thêm giỏ hàng:", err);
      alert(err.message || "Thêm sản phẩm thất bại!");
    } finally {
      setLoadingId(null);
    }
  };

  // phân trang dữ liệu
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / perPage);

  return (
    <div className="p-6">
      {/* grid sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map((sp) => (
          <div
            key={sp.ma_san_pham}
            className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Ảnh */}
            <div className="relative w-full h-52 bg-gray-50 overflow-hidden">
              <img
                src={sp.hinh_anh || "/no-image.png"}
                alt={sp.ten_san_pham}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
                Mới
              </span>
            </div>

            {/* Nội dung */}
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
                Danh mục: {sp.ten_danh_muc}
              </p>

              {/* Nút */}
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
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  disabled={loadingId === sp.ma_san_pham}
                  onClick={() => addToCart(sp)} // 🛒 thêm giỏ hàng
                >
                  <ShoppingCart size={16} /> Giỏ
                </button>

                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  disabled={loadingId === sp.ma_san_pham}
                  onClick={() => addToCart(sp, true)} // ⚡ mua ngay
                >
                  <Zap size={16} /> Mua
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
