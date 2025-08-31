"use client";
import { useState } from "react";
import Image from "next/image";

export default function DangNhapPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/dangnhap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Đăng nhập thành công!");
      console.log("User:", data.user);
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-96 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <a href="/home">
            <Image src="/logo.png" alt="OBG Logo" width={60} height={60} />
          </a>
        </div>

        {/* Tiêu đề */}
        <h2 className="text-xl font-semibold mb-4 text-yellow-700">LOGIN</h2>
        <p className="text-sm text-black mb-6">Sign in to your account</p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-yellow-700 text-white py-2 rounded-md font-semibold"
          >
            Login
          </button>
        </form>

        {/* Thông báo */}
        {message && <p className="mt-4 text-red-500">{message}</p>}

        {/* Links */}
        <p className="text-sm text-gray-500 mt-4">
          I forgot my password.{" "}
          <a href="#" className="text-yellow-700">
            Click here
          </a>{" "}
          to reset.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          <a href="/dangky" className="text-gray-700 font-semibold">
            Register new account
          </a>
        </p>
      </div>
    </div>
  );
}
