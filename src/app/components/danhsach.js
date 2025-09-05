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

  // Hàm thêm vào giỏ hàng
  const addToCart = async (ma_san_pham) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Nếu chưa đăng nhập → chuyển hướng
      if (!token) {
        alert(" Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
        window.location.href = "/dangnhap";
        return;
      }

      const res = await fetch("/api/home/shop-cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // gửi token
        },
        body: JSON.stringify({ ma_san_pham, so_luong: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // Token hết hạn hoặc không hợp lệ → chuyển hướng
          alert(" Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          localStorage.removeItem("token");
          window.location.href = "/dangnhap";
          return;
        }
        throw new Error(data?.message || "Không thể thêm vào giỏ hàng");
      }

      console.log(" Đã thêm vào giỏ:", data);
      alert(" Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      console.error("Lỗi thêm giỏ hàng:", err);
      alert(err.message || "Thêm sản phẩm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map((sp) => (
        <div
          key={sp.ma_san_pham}
          className="bg-white border rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] transition transform flex flex-col"
        >
          {/* Ảnh sản phẩm */}
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={sp.hinh_anh || "/no-image.png"}
              alt={sp.ten_san_pham}
              className="w-full h-full object-cover hover:scale-110 transition"
            />
          </div>

          {/* Nội dung */}
          <div className="p-4 flex flex-col flex-1">
            <h4 className="font-semibold text-lg text-gray-800 mb-1">
              {sp.ten_san_pham}
            </h4>
            <p className="text-sm text-gray-500 line-clamp-2 flex-1">
              {sp.mo_ta || "Không có mô tả"}
            </p>

            <p className="text-red-600 font-bold text-lg mt-2">
              {sp.gia.toLocaleString()}đ
            </p>
            <p className="text-xs text-gray-400">Danh mục: {sp.ten_danh_muc}</p>

            {/* Nút */}
            <div className="flex gap-2 mt-4">
              <a
                href={`/home2/product_details/${sp.ma_san_pham}`}
                className="flex-1"
              >
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                  <Eye size={16} /> Xem
                </button>
              </a>

              <button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                disabled={loading}
                onClick={() => addToCart(sp.ma_san_pham)}
              >
                <ShoppingCart size={16} /> Giỏ
              </button>

              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <Zap size={16} /> Mua
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
