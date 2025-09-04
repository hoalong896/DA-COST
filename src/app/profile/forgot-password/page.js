"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/auth/quen_mk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage(" Lỗi server!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-[400px]"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Quên mật khẩu</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded mb-4 text-black"
          placeholder="Nhập email của bạn"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Gửi link đặt lại
        </button>

        {message && <p className="text-center text-sm mt-3">{message}</p>}
      </form>
    </div>
  );
}
