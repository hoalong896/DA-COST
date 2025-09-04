"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "Phản hồi không hợp lệ từ server" };
      }

      setMessage(data.message || "Có lỗi xảy ra!");

      if (res.ok) {
        setTimeout(() => router.push("/profile"), 1500);
      }
    } catch (err) {
      console.error("Change password error:", err);
      setMessage("Lỗi server!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4"> Đổi mật khẩu</h2>

        <div className="mb-3">
          <label className="block mb-1">Mật khẩu cũ</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Xác nhận
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
