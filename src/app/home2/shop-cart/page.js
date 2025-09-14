"use client";
import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ShopCartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Chưa đăng nhập");

      const res = await fetch("/api/home/shop-cart", {
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể tải giỏ hàng");

      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Xóa sản phẩm
  async function handleRemove(ma_ct) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/home/shop-cart/${ma_ct}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể xóa sản phẩm");

      setCart((prev) => ({
        ...prev,
        chi_tiet_gio_hang: prev.chi_tiet_gio_hang.filter(
          (sp) => sp.ma_ct !== ma_ct
        ),
      }));
    } catch (err) {
      alert(err.message);
    }
  }

  // Cập nhật số lượng
  async function handleUpdateQuantity(ma_ct, newQuantity) {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/home/shop-cart/${ma_ct}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ so_luong: newQuantity }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể cập nhật");

      setCart((prev) => ({
        ...prev,
        chi_tiet_gio_hang: prev.chi_tiet_gio_hang.map((sp) =>
          sp.ma_ct === ma_ct ? { ...sp, so_luong: newQuantity } : sp
        ),
      }));
    } catch (err) {
      alert(err.message);
    }
  }

  // Chuyển sang trang thanh toán
  function handleCheckout() {
    const selectedProducts = cart.chi_tiet_gio_hang.filter((item) =>
      selectedItems.includes(item.ma_ct)
    );

    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }

    // Lưu tạm sản phẩm và tổng tiền vào localStorage
    localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));

    const totalAmount = selectedProducts.reduce(
      (sum, item) => sum + item.so_luong * item.san_pham.gia,
      0
    );
    localStorage.setItem("checkoutTotal", totalAmount);

    // Chuyển trang
    router.push("/home2/shop-cart/payment");
  }

  if (loading) return <div className="p-6">Đang tải giỏ hàng...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.chi_tiet_gio_hang.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.chi_tiet_gio_hang.map((item) => item.ma_ct));
    }
  };

  const totalAmount = cart.chi_tiet_gio_hang
    .filter((item) => selectedItems.includes(item.ma_ct))
    .reduce((sum, item) => sum + item.so_luong * item.san_pham.gia, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🛒 Giỏ hàng của bạn</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-gray-100 font-semibold text-gray-700">
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={
                selectedItems.length === cart.chi_tiet_gio_hang.length &&
                cart.chi_tiet_gio_hang.length > 0
              }
              onChange={toggleSelectAll}
            />
            Sản phẩm
          </div>
          <div>Đơn giá</div>
          <div>Số lượng</div>
          <div>Số tiền</div>
          <div>Hành động</div>
        </div>

        {/* Danh sách sản phẩm */}
        {cart.chi_tiet_gio_hang.map((item) => (
          <div
            key={item.ma_ct}
            className="grid grid-cols-6 gap-4 px-4 py-4 border-t items-center"
          >
            <div className="col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.ma_ct)}
                onChange={() => toggleSelect(item.ma_ct)}
              />
              <img
                src={item.san_pham.san_pham_anh[0]?.url || "/no-image.png"}
                alt={item.san_pham.ten_san_pham}
                className="w-16 h-16 object-cover rounded"
              />
              <span className="font-medium">{item.san_pham.ten_san_pham}</span>
            </div>

            <div className="text-red-600 font-semibold">
              {item.san_pham.gia.toLocaleString()}₫
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleUpdateQuantity(item.ma_ct, item.so_luong - 1)
                }
                className="p-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                <Minus size={14} />
              </button>
              <span>{item.so_luong}</span>
              <button
                onClick={() =>
                  handleUpdateQuantity(item.ma_ct, item.so_luong + 1)
                }
                className="p-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="font-bold text-gray-800">
              {(item.so_luong * item.san_pham.gia).toLocaleString()}₫
            </div>

            <div>
              <button
                onClick={() => handleRemove(item.ma_ct)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 p-4 bg-gray-100 rounded-lg">
        <Link
          href="/home2"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} /> Quay lại mua hàng
        </Link>

        <div className="flex items-center gap-6">
          <span className="font-medium">
            Tổng cộng ({selectedItems.length} sản phẩm):{" "}
            <span className="text-red-600 font-bold">
              {totalAmount.toLocaleString()}₫
            </span>
          </span>
          <button
            onClick={handleCheckout}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
