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
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

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
      store_name: role === "NGUOI_BAN" ? storeName : "",
      store_address: role === "NGUOI_BAN" ? storeAddress : "",
    };

    try {
      const res = await fetch("/api/auth/dangky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng ký thành công! Hãy đăng nhập.");
        router.push("/dangnhap");
      } else {
        setMessage(data.message || data.error || "Đăng ký thất bại");
      }
    } catch (err) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-96 text-center border text-black">
        {/* Logo */}
        <div className="flex items-center justify-start mb-6">
          <a href="/home">
            <Image src="/logo.png" alt="OBG Logo" width={70} height={60} />
          </a>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-yellow-700">Register</h2>

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
            <span>Buyer</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer text-yellow-700">
            <input
              type="radio"
              name="role"
              value="NGUOI_BAN"
              checked={role === "NGUOI_BAN"}
              onChange={() => setRole("NGUOI_BAN")}
            />
            <span>Seller</span>
          </label>
        </div>

        {/* Form */}
        <form className="space-y-3 text-left" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full name"
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          {role === "NGUOI_BAN" && (
            <>
              <input
                type="text"
                placeholder="Store name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Store address"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-700 text-white py-2 rounded-md font-semibold"
          >
            Register
          </button>
        </form>

        {/* Message */}
        {message && <p className="text-sm text-red-600 mt-4">{message}</p>}

        {/* Sign in Link */}
        <p className="text-sm text-black mt-4">
          Already have an account?{" "}
          <a
            href="/dangnhap"
            className="text-yellow-700 font-semibold hover:underline"
          >
            Sign in ?
          </a>
        </p>
      </div>
    </div>
  );
}
