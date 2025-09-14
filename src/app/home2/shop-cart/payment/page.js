"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [phuongThuc, setPhuongThuc] = useState("COD");

  // Cho phép chỉnh sửa
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // 🔑 Lấy thông tin user
    fetch("/api/auth/profile", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setHoTen(data.user.ho_ten || "");
        setSoDienThoai(data.user.so_dien_thoai || "");
        setDiaChi(data.user.dia_chi || "");
      });

    // 🔄 Lấy dữ liệu checkout (giỏ hàng hoặc mua ngay)
    const storedItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    const storedTotal = Number(localStorage.getItem("checkoutTotal")) || 0;
    const checkoutMode = localStorage.getItem("checkoutMode"); // "cart" | "buyNow"

    if (checkoutMode === "buyNow") {
      // 👉 Chỉ hiển thị sản phẩm vừa chọn ở trang chủ
      setItems(storedItems);
      setTotal(storedTotal);
    } else {
      // 👉 Mặc định: hiển thị danh sách từ giỏ hàng
      setItems(storedItems);
      setTotal(storedTotal);
    }
  }, [router]);

  async function handlePayment() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/home/shop-cart/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          phuong_thuc: phuongThuc,
          tong_tien: total,
          ho_ten: hoTen,
          so_dien_thoai: soDienThoai,
          dia_chi: diaChi,
          chi_tiet: items.map((sp) => ({
            ma_san_pham: sp.san_pham.ma_san_pham,
            so_luong: sp.so_luong,
            don_gia: sp.san_pham.gia,
            ma_nguoi_ban: sp.san_pham.ma_nguoi_ban,
          })),
        }),
      });

      const data = await res.json();

      console.log("Payment API response:", res.status, data);

      if (!res.ok) {
        alert("Thanh toán thất bại: " + (data.message || "Lỗi không xác định"));
        return;
      }

      // ✅ Clear dữ liệu tạm sau khi thanh toán thành công
      localStorage.removeItem("checkoutItems");
      localStorage.removeItem("checkoutTotal");
      localStorage.removeItem("checkoutMode");

      // ✅ Báo thành công rồi mới chuyển trang
      alert("Thanh toán thành công!");
      router.push("/home2/shop-cart/payment/success");
    } catch (err) {
      alert("Lỗi thanh toán: " + err.message);
    }
  }

  if (!user) return <div className="p-6">Đang tải thông tin...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>

      {/* Thông tin người mua */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="font-semibold mb-2">Thông tin người mua</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            placeholder="Họ tên"
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={soDienThoai}
            onChange={(e) => setSoDienThoai(e.target.value)}
            placeholder="Số điện thoại"
            className="border p-2 rounded"
          />
          <textarea
            value={diaChi}
            onChange={(e) => setDiaChi(e.target.value)}
            placeholder="Địa chỉ giao hàng"
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* Sản phẩm */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="font-semibold mb-2">Sản phẩm</h2>
        {items.map((sp) => (
          <div
            key={sp.ma_ct || sp.san_pham.ma_san_pham}
            className="flex justify-between border-b py-2 text-sm"
          >
            <span>
              {sp.san_pham.ten_san_pham} × {sp.so_luong}
            </span>
            <span>{(sp.so_luong * sp.san_pham.gia).toLocaleString()}₫</span>
          </div>
        ))}
        <div className="font-bold text-right mt-2">
          Tổng: {Number(total).toLocaleString()}₫
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="font-semibold mb-2">Phương thức thanh toán</h2>
        <select
          value={phuongThuc}
          onChange={(e) => setPhuongThuc(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="COD">Thanh toán khi nhận hàng (COD)</option>
          <option value="BANK">Chuyển khoản ngân hàng</option>
        </select>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Xác nhận thanh toán
      </button>
    </div>
  );
}
