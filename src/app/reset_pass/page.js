"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setTimeout(() => router.push("/dangnhap"), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <form
        onSubmit={handleSubmit}
        className="p-6 border rounded w-80 bg-white shadow space-y-4 text-black"
      >
        <h2 className="text-xl font-bold">Đặt lại mật khẩu</h2>
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded text-black"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Xác nhận
        </button>
        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
