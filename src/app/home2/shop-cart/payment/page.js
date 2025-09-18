"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [phuongThuc, setPhuongThuc] = useState("COD");

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

    fetch("/api/auth/profile", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          alert("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
          router.push("/login");
          return;
        }
        setUser(data.user);
        setHoTen(data.user.ho_ten || "");
        setSoDienThoai(data.user.so_dien_thoai || "");
        setDiaChi(data.user.dia_chi || "");
      })
      .catch((err) => {
        console.error("Lỗi lấy thông tin user:", err);
        alert("Lỗi lấy thông tin người dùng.");
        router.push("/login");
      });

    const storedItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    const storedTotal = Number(localStorage.getItem("checkoutTotal")) || 0;
    setItems(storedItems);
    setTotal(storedTotal);
  }, [router]);

  async function handlePayment() {
    if (!items.length) {
      alert("Không có sản phẩm hợp lệ để thanh toán!");
      return;
    }

    const chiTiet = items
      .map((sp) => {
        const maSanPham = sp.san_pham?.ma_san_pham || sp.ma_san_pham;
        if (!maSanPham) return null;
        const donGia = sp.san_pham?.gia || sp.don_gia || 0;
        const soLuong = Number(sp.so_luong) || 1;
        return {
          ma_san_pham: Number(maSanPham),
          so_luong: soLuong,
          don_gia: Number(donGia),
        };
      })
      .filter(Boolean);

    if (!chiTiet.length) {
      alert("Không có sản phẩm hợp lệ để thanh toán!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
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
          chi_tiet: chiTiet,
        }),
      });

      const data = await res.json();
      console.log("Payment API response:", res.status, data);

      if (!res.ok) {
        alert("Thanh toán thất bại: " + (data.message || "Lỗi không xác định"));
        return;
      }

      localStorage.removeItem("checkoutItems");
      localStorage.removeItem("checkoutTotal");
      localStorage.removeItem("checkoutMode");

      alert("Thanh toán thành công!");
      window.dispatchEvent(
        new CustomEvent("add-notification", { detail: "Mua hàng thành công" })
      );
      router.push("/home2/shop-cart/payment/success");
    } catch (err) {
      alert("Lỗi thanh toán: " + err.message);
    }
  }

  if (!user) return <div className="p-6">Đang tải thông tin...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>

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

      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="font-semibold mb-2">Sản phẩm</h2>
        {items.length ? (
          items.map((sp) => (
            <div
              key={sp.ma_ct || sp.san_pham?.ma_san_pham || sp.ma_san_pham}
              className="flex justify-between border-b py-2 text-sm"
            >
              <span>
                {sp.san_pham?.ten_san_pham || "Sản phẩm không xác định"} ×{" "}
                {sp.so_luong || 1}
              </span>
              <span>
                {(
                  Number(sp.so_luong) *
                  Number(sp.san_pham?.gia || sp.don_gia || 0)
                ).toLocaleString()}
                ₫
              </span>
            </div>
          ))
        ) : (
          <div>Không có sản phẩm nào trong giỏ hàng.</div>
        )}
        <div className="font-bold text-right mt-2">
          Tổng: {Number(total).toLocaleString()}₫
        </div>
      </div>

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
      <button
        onClick={() => router.push("/home2")}
        className="w-full mt-3 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
      >
        Quay lại trang chủ
      </button>
    </div>
  );
}
