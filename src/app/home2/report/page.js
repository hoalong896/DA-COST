"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReportForm({ productId }) {
  const [reason, setReason] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 2) {
      alert("Chỉ được chọn tối đa 2 ảnh");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId || "123");
    formData.append("reason", reason);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const res = await fetch("/api/auth/report", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi khi gửi báo cáo!");
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🚨</span> Báo cáo sản phẩm
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lý do báo cáo
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">-- Chọn lý do --</option>
              <option value="Hàng giả">Hàng giả</option>
              <option value="Thông tin sai lệch">Thông tin sai lệch</option>
              <option value="Spam">Spam</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ảnh minh chứng (tối đa 2 ảnh)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-3 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-600
                hover:file:bg-blue-100
              "
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition ${
              isLoggedIn
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoggedIn ? "Gửi báo cáo" : "Đăng nhập để báo cáo"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
