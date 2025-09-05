"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ThemSanPhamPage() {
  const [tenSanPham, setTenSanPham] = useState("");
  const [gia, setGia] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [moTa, setMoTa] = useState("");
  const [danhMuc, setDanhMuc] = useState(""); // sẽ lưu ID
  const [categories, setCategories] = useState([]); // 👉 danh sách danh mục
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // lấy danh mục
  useEffect(() => {
    fetch("/api/admin/categories/get_categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi:", err));
  }, []);

  // xử lý chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  // xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Bạn cần đăng nhập để thêm sản phẩm!");
        router.push("/dangnhap");
        return;
      }

      const formData = new FormData();
      formData.append("ten_san_pham", tenSanPham);
      formData.append("gia", gia);
      formData.append("so_luong_ton", soLuong); // gửi số lượng
      formData.append("mo_ta", moTa);
      formData.append("ma_danh_muc", danhMuc);
      if (image) formData.append("image", image);

      const res = await fetch("/api/seller/my-shop/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(" Thêm sản phẩm thành công!");
        setTimeout(() => router.push("/seller/my-shop"), 1200);
      } else {
        setMessage(data.message || " Thêm sản phẩm thất bại!");
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setMessage(" Lỗi server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[450px]">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
          Thêm sản phẩm mới
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên sản phẩm */}
          <div>
            <label className="font-semibold">Tên sản phẩm:</label>
            <input
              type="text"
              value={tenSanPham}
              onChange={(e) => setTenSanPham(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          {/* Giá */}
          <div>
            <label className="font-semibold">Giá:</label>
            <input
              type="number"
              value={gia}
              onChange={(e) => setGia(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          {/* Số lượng tồn */}
          <div>
            <label className="font-semibold">Số lượng:</label>
            <input
              type="number"
              value={soLuong}
              onChange={(e) => setSoLuong(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="font-semibold">Mô tả:</label>
            <textarea
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              rows="3"
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="font-semibold">Danh mục:</label>
            <select
              value={danhMuc}
              onChange={(e) => setDanhMuc(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded mt-1"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.ma_danh_muc} value={cat.ma_danh_muc}>
                  {cat.ten_danh_muc}
                </option>
              ))}
            </select>
          </div>

          {/* Ảnh sản phẩm */}
          <div>
            <label className="font-semibold">Ảnh sản phẩm:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          {/* Hiển thị preview ảnh */}
          {preview && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-1">Ảnh xem trước:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-md border"
              />
            </div>
          )}

          {/* Nút submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Đang thêm..." : "Thêm sản phẩm"}
          </button>
        </form>

        {/* Thông báo */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("")
                ? "text-green-600 font-semibold"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Quay lại */}
        <button
          onClick={() => router.push("/seller/my-shop")}
          className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
        >
          ⬅ Quay lại gian hàng
        </button>
      </div>
    </div>
  );
}
