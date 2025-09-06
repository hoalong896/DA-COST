"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 🛒 Lấy giỏ hàng
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("/api/home/shop-cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        const items = (data.chi_tiet_gio_hang || []).map((ct) => ({
          id: ct.ma_san_pham,
          name: ct.san_pham.ten_san_pham, // 👈 fix theo model prisma
          price: ct.san_pham.gia,
          qty: ct.so_luong,
          image: ct.san_pham.san_pham_anh?.[0]?.url || "/no-image.png",
          ma_nguoi_ban: ct.san_pham.ma_nguoi_ban, // 👈 cần để tạo chi_tiet_don_hang
        }));

        setProducts(items);
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
      }
    }
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🗑 Xoá sản phẩm
  const handleRemove = async (id) => {
    try {
      await fetch(`/api/home/shop-cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Lỗi xoá sản phẩm:", error);
    }
  };

  // ✅ Đặt hàng
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const chi_tiet = products.map((p) => ({
        ma_san_pham: p.id,
        so_luong: p.qty,
        don_gia: p.price,
        ma_nguoi_ban: p.ma_nguoi_ban,
      }));

      const tong_tien = chi_tiet.reduce(
        (sum, item) => sum + item.so_luong * item.don_gia,
        0
      );

      const res = await fetch("/api/home/shop-cart/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          phuong_thuc: payment,
          tong_tien,
          chi_tiet,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("lastOrder", JSON.stringify(data.donHang));
        router.push("/home2/shop-cart/payment/success");
      } else {
        alert(data.message || "Có lỗi xảy ra khi đặt hàng");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Có lỗi xảy ra khi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-black">⏳ Đang xử lý...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <p className="text-lg">🛒 Giỏ hàng của bạn đang trống</p>
        <a
          href="/home2"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Tiếp tục mua sắm
        </a>
      </div>
    );
  }

  const subtotal = products.reduce((sum, p) => sum + p.price * p.qty, 0);
  const shippingFee = shipping === "fast" ? 45000 : 25000;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* Steps */}
      <div className="flex justify-center gap-16 mb-10 text-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-black">
            1
          </div>
          <span className="mt-2 text-sm text-black">Giỏ hàng</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
            2
          </div>
          <span className="mt-2 text-sm text-black">Thanh toán</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-black">
            3
          </div>
          <span className="mt-2 text-sm text-black">Hoàn tất</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="font-bold text-xl mb-4 text-black">
            Thông tin nhận hàng
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              name="name"
              placeholder="Họ và tên"
              className="border p-3 rounded-lg text-black"
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Số điện thoại"
              className="border p-3 rounded-lg text-black"
              value={form.phone}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
              className="border p-3 rounded-lg text-black"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="address"
              placeholder="Địa chỉ"
              className="border p-3 rounded-lg text-black"
              value={form.address}
              onChange={handleChange}
            />
            <input
              name="note"
              placeholder="Ghi chú (tùy chọn)"
              className="border p-3 rounded-lg text-black"
              value={form.note}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-gray-100 rounded-2xl shadow p-6 text-black">
          <h2 className="font-bold text-xl mb-4">Đơn hàng</h2>

          {products.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center border-b py-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm">Giá: {p.price.toLocaleString()}đ</p>
                  <p className="text-sm">SL: x{p.qty}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(p.id)}
                className="text-red-500 hover:underline"
              >
                Xoá
              </button>
            </div>
          ))}

          <div className="mt-4 text-sm space-y-2 text-black">
            <div className="flex justify-between">
              <span>Tạm tính</span> <span>{subtotal.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>{" "}
              <span>{shippingFee.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng</span> <span>{total.toLocaleString()}đ</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "ĐẶT HÀNG / THANH TOÁN"}
          </button>
        </div>
      </div>
    </div>
  );
}
