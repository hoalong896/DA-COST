"use client";
import { useEffect, useState } from "react";
import { ShoppingCart, Eye, Zap } from "lucide-react";

export default function DanhSach({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "/api/home/product";
        if (category) url += `?category=${category}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) setProducts(data);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      }
    };
    fetchProducts();
  }, [category]);

  // ✅ Thêm giỏ hàng
  const addToCart = async (ma_san_pham, redirect = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Vui lòng đăng nhập trước khi mua hàng!");
        window.location.href = "/dangnhap";
        return;
      }

      const res = await fetch("/api/home/shop-cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ma_san_pham, so_luong: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          localStorage.removeItem("token");
          window.location.href = "/dangnhap";
          return;
        }
        throw new Error(data?.message || "Không thể thêm vào giỏ hàng");
      }

      if (redirect) {
        // 👈 Nếu là "Mua ngay" → chuyển sang checkout
        window.location.href = "/home2/shop-cart/payment";
      } else {
        alert("✅ Đã thêm sản phẩm vào giỏ hàng!");
      }
    } catch (err) {
      console.error("Lỗi thêm giỏ hàng:", err);
      alert(err.message || "Thêm sản phẩm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((sp) => (
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
                disabled={loading}
                onClick={() => addToCart(sp.ma_san_pham)}
              >
                <ShoppingCart size={16} /> Giỏ
              </button>

              <button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={loading}
                onClick={() => addToCart(sp.ma_san_pham, true)}
              >
                <Zap size={16} /> Mua
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
