"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DangKyPage() {
  const [role, setRole] = useState("KHACH");
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (password !== confirmPassword) {
      setMessage("Mật khẩu không khớp!");
      return;
    }

    const payload = {
      ho_ten: hoTen,
      email,
      mat_khau: password,
      vai_tro: role,
      so_dien_thoai: phone,
      dia_chi: address,
      ten_cua_hang: role === "NGUOI_BAN" ? storeName : "",
      dia_chi_cua_hang: role === "NGUOI_BAN" ? storeAddress : "",
    };

    try {
      setLoading(true);
      const res = await fetch("/api/auth/dangky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("🎉 Đăng ký thành công! Đang chuyển hướng...");
        setIsSuccess(true);
        setTimeout(() => router.push("/dangnhap"), 1500);
      } else {
        setMessage(data.message || data.error || "Đăng ký thất bại");
      }
    } catch (err) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md text-center border text-black">
        {/* Logo */}
        <div className="flex items-center justify-start mb-6">
          <a href="/home">
            <Image src="/logo.png" alt="Logo" width={70} height={60} />
          </a>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-yellow-700">Đăng ký tài khoản</h2>

        {/* Role Selection */}
        <div className="flex justify-center space-x-6 mb-4">
          <label className="flex items-center space-x-2 cursor-pointer text-yellow-700">
            <input
              type="radio"
              name="role"
              value="KHACH"
              checked={role === "KHACH"}
              onChange={() => setRole("KHACH")}
            />
            <span>Người mua</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer text-yellow-700">
            <input
              type="radio"
              name="role"
              value="NGUOI_BAN"
              checked={role === "NGUOI_BAN"}
              onChange={() => setRole("NGUOI_BAN")}
            />
            <span>Người bán</span>
          </label>
        </div>

        {/* Form */}
        <form className="space-y-3 text-left" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Họ tên"
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
            required
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
            required
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
            required
            autoComplete="new-password"
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
            required
            autoComplete="tel"
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
            required
            autoComplete="street-address"
          />

          {role === "NGUOI_BAN" && (
            <>
              <input
                type="text"
                placeholder="Tên cửa hàng"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="text"
                placeholder="Địa chỉ cửa hàng"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500"
                required
              />
            </>
          )}

          <button
            type="submit"
            className={`w-full bg-yellow-700 text-white py-2 rounded-md font-semibold transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-800"
            }`}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`text-sm mt-4 ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Sign in Link */}
        <p className="text-sm text-black mt-4">
          Đã có tài khoản?{" "}
          <a
            href="/dangnhap"
            className="text-yellow-700 font-semibold hover:underline"
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}
