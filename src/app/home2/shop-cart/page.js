"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ArrowLeft, CheckSquare } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();

  // 📌 Lấy giỏ hàng
  async function fetchCart() {
    const res = await fetch("/api/home/shop-cart", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Không thể tải giỏ hàng");
    const data = await res.json();
    setCart(data); // 👈 thêm dòng này
    return data;
  }

  useEffect(() => {
    fetchCart();
  }, []);

  // 📌 Update số lượng
  const updateQuantity = async (ma_ct, so_luong) => {
    if (so_luong < 1) return;
    setLoading(true);
    try {
      await fetch("/api/home/shop-cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ma_ct, so_luong }),
      });
      await fetchCart(); // 👈 load lại giỏ hàng mới nhất
    } catch (err) {
      console.error("❌ Lỗi updateQuantity:", err);
    }
    setLoading(false);
  };

  // 📌 Xóa sản phẩm
  const removeItem = async (ma_ct) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    setLoading(true);
    try {
      // Xóa ngay trên FE để UI phản ứng nhanh
      setCart((prev) => ({
        ...prev,
        chi_tiet_gio_hang: prev.chi_tiet_gio_hang.filter(
          (item) => item.ma_ct !== ma_ct
        ),
      }));

      // Gọi API để xóa trong DB
      await fetch("/api/home/shop-cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ma_ct }),
      });
    } catch (err) {
      console.error("❌ Lỗi removeItem:", err);
    }
    setLoading(false);
  };

  // 📌 Toggle chọn sản phẩm
  const toggleSelect = (ma_ct) => {
    setSelectedItems((prev) =>
      prev.includes(ma_ct)
        ? prev.filter((id) => id !== ma_ct)
        : [...prev, ma_ct]
    );
  };

  // 📌 Toggle chọn tất cả
  const toggleSelectAll = () => {
    if (selectedItems.length === cart.chi_tiet_gio_hang.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.chi_tiet_gio_hang.map((item) => item.ma_ct));
    }
  };

  // 📌 Tổng tiền
  const total =
    cart?.chi_tiet_gio_hang
      ?.filter((item) => selectedItems.includes(item.ma_ct))
      .reduce((sum, item) => sum + item.san_pham.gia * item.so_luong, 0) || 0;

  // 📌 Giỏ hàng trống
  if (!cart || !cart.chi_tiet_gio_hang?.length) {
    return (
      <div className="p-6 flex flex-col items-center justify-center bg-gray-50 min-h-screen text-gray-600">
        <p className="text-xl"> Giỏ hàng của bạn đang trống</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-5 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-800 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Giỏ hàng</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header chọn tất cả */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={
                selectedItems.length === cart.chi_tiet_gio_hang.length &&
                selectedItems.length > 0
              }
              onChange={toggleSelectAll}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">
              Chọn tất cả
            </span>
          </label>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="divide-y">
          {cart.chi_tiet_gio_hang.map((item) => (
            <div
              key={item.ma_ct}
              className="flex items-center gap-4 p-4 hover:bg-gray-50"
            >
              {/* Chọn */}
              <input
                type="checkbox"
                checked={selectedItems.includes(item.ma_ct)}
                onChange={() => toggleSelect(item.ma_ct)}
                className="w-4 h-4"
              />

              {/* Ảnh */}
              <img
                src={item.san_pham.san_pham_anh?.[0]?.url || "/no-image.png"}
                alt={item.san_pham.ten_san_pham}
                className="w-20 h-20 object-cover rounded-md border"
              />

              {/* Thông tin */}
              <div className="flex-1">
                <h2 className="font-medium text-gray-800">
                  {item.san_pham.ten_san_pham}
                </h2>
                <p className="text-gray-500 text-sm">
                  {item.san_pham.gia.toLocaleString()}đ
                </p>
              </div>

              {/* Số lượng */}
              <button
                className="px-2 py-1 rounded border text-black font-bold hover:bg-gray-100 disabled:opacity-50"
                disabled={loading || item.so_luong <= 1}
                onClick={() => updateQuantity(item.ma_ct, item.so_luong - 1)}
              >
                -
              </button>
              <span className="w-8 text-center text-black font-medium">
                {item.so_luong}
              </span>
              <button
                className="px-2 py-1 rounded border text-black font-bold hover:bg-gray-100 disabled:opacity-50"
                disabled={loading}
                onClick={() => updateQuantity(item.ma_ct, item.so_luong + 1)}
              >
                +
              </button>

              {/* Tổng tiền sản phẩm */}
              <div className="w-28 text-right font-semibold text-red-600">
                {(item.san_pham.gia * item.so_luong).toLocaleString()}đ
              </div>

              {/* Xóa */}
              <button
                onClick={() => removeItem(item.ma_ct)}
                className="text-gray-400 hover:text-red-500"
                disabled={loading}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-4 mt-6 bg-white rounded-xl shadow-md">
        <div className="text-gray-700">
          Tổng cộng ({selectedItems.length} sản phẩm):{" "}
          <span className="text-red-600 font-bold text-lg">
            {total.toLocaleString()}đ
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Tiếp tục mua
          </button>
          <button
            className="px-5 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-800 flex items-center gap-2"
            disabled={selectedItems.length === 0}
          >
            <CheckSquare size={18} /> Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
