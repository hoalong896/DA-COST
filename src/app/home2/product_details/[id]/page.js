"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Zap } from "lucide-react";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ loading cho nút giỏ hàng / mua ngay
  const [loadingCart, setLoadingCart] = useState(false);

  // State đánh giá
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleSubmitReview = () => {
    if (!rating || !comment.trim()) {
      alert("Vui lòng chọn số sao và nhập bình luận!");
      return;
    }

    const newReview = { user: "Bạn", rating, comment };
    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment("");
  };

  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/home/product/${id}`);
        const data = await res.json();
        if (res.ok) setProduct(data);
        else {
          setProduct(null);
          alert(data.error || "Có lỗi xảy ra!");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Không thể kết nối tới server!");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ thêm giỏ hàng
  const addToCart = async (redirect = false) => {
    try {
      setLoadingCart(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Vui lòng đăng nhập trước khi mua hàng!");
        router.push("/dangnhap");
        return;
      }

      if (redirect) {
        const item = { san_pham: product, so_luong: 1 };
        localStorage.setItem("checkoutItems", JSON.stringify([item]));
        localStorage.setItem("checkoutTotal", product.gia);
        localStorage.setItem("checkoutMode", "buyNow");

        router.push("/home2/shop-cart/payment");
      } else {
        const res = await fetch("/api/home/shop-cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ma_san_pham: product.ma_san_pham,
            so_luong: 1,
          }),
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.message || data?.error || "Thêm thất bại!");

        alert("✅ Đã thêm vào giỏ hàng!");
      }
    } catch (err) {
      console.error("Lỗi giỏ hàng:", err);
      alert(err.message || "Không thể thêm giỏ hàng!");
    } finally {
      setLoadingCart(false);
    }
  };

  if (loading) return <p className="p-6">Đang tải chi tiết sản phẩm...</p>;
  if (!product) return <p className="p-6">Không tìm thấy sản phẩm.</p>;

  return (
    <div className="p-6 space-y-6 bg-[#f5fbff] min-h-screen text-gray-900">
      {/* Nút điều hướng */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => router.push("/home2")}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300"
        >
          ← Quay lại
        </button>
        <button
          onClick={() => router.push("/home2/report")}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        >
          🚩 Báo cáo
        </button>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Ảnh sản phẩm */}
          <div className="w-1/3 cursor-pointer">
            <img
              src={product.hinh_anh?.[0]?.url || "/placeholder.png"}
              alt={product.ten_san_pham}
              className="w-60 h-70 object-cover rounded-md"
              onClick={() =>
                setZoomImage(product.hinh_anh?.[0]?.url || "/placeholder.png")
              }
            />
          </div>

          {/* Chi tiết */}
          <div className="flex-1 space-y-3">
            <h1 className="text-2xl font-bold text-blue-700">
              {product.ten_san_pham}
            </h1>
            <p className="text-xl text-red-600 font-bold">
              {product.gia.toLocaleString()} VND
            </p>
            <p>
              <b>Mô tả:</b> {product.mo_ta || "Không có mô tả"}
            </p>
            <p>
              <b>Số lượng tồn:</b> {product.so_luong_ton ?? 0}
            </p>
            <p>
              <b>Danh mục:</b> {product.danh_muc?.ten_danh_muc}
            </p>
            <p>
              <b>Trạng thái:</b>{" "}
              {product.so_luong_ton > 0 ? (
                <span className="text-green-600 font-semibold">Còn hàng</span>
              ) : (
                <span className="text-red-600 font-semibold">Hết hàng</span>
              )}
            </p>

            {/* Nút giỏ hàng và mua ngay */}
            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-base bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                disabled={loadingCart}
                onClick={() => addToCart(false)}
              >
                <ShoppingCart size={18} /> Thêm giỏ
              </button>

              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-base bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={loadingCart || product.so_luong_ton <= 0}
                onClick={() => addToCart(true)}
              >
                <Zap size={18} /> Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin shop */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          <img
            src={product.nguoi_ban?.avatar || "/default-avatar.png"}
            alt="Avatar người bán"
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div className="flex-1">
  {/* Tên cửa hàng */}
  <h2 className="text-lg font-bold">
    {product.nguoi_ban?.ten_cua_hang || "Tên cửa hàng"}
  </h2>

  {/* Tên người bán */}
  <p className="text-sm text-gray-700">
    👤 {product.nguoi_ban?.ho_ten || "Tên người bán"}
  </p>

  {/* Email */}
  <p className="text-sm text-gray-600">
    📧 {product.nguoi_ban?.email || "Chưa có email"}
  </p>
</div>

          <div className="flex gap-2" >
            <button className="px-3 py-1 border border-gray-400 rounded-lg hover:bg-gray-100"
            onClick={() => router.push("/home2/message")}>
              Liên hệ
            </button>
            <button className="px-3 py-1 border border-gray-400 rounded-lg hover:bg-gray-100 "
            onClick={() => router.push("/seller/profile")}>
              Xem Shop
            </button>
          </div>
        </div>
      </div>

      {/* Đánh giá + Bình luận */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-bold mb-3 text-lg">Đánh giá sản phẩm</h3>

        {/* Rating sao */}
        <div className="flex mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Nhập bình luận */}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 mb-3 bg-white text-black focus:ring-2 focus:ring-blue-400"
          rows="3"
          placeholder="Nhập bình luận..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <button
          onClick={handleSubmitReview}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Gửi đánh giá
        </button>

        {/* Danh sách đánh giá */}
        <div className="mt-6 space-y-4">
          {reviews.length === 0 && (
            <p className="text-gray-500">Chưa có đánh giá nào.</p>
          )}
          {reviews.map((rv, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border"
            >
              <img
                src="/default-avatar.png"
                alt="user avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold">{rv.user}</p>
                <p className="text-yellow-500">
                  {"★".repeat(rv.rating)}
                  <span className="text-gray-300">
                    {"★".repeat(5 - rv.rating)}
                  </span>
                </p>
                <p className="text-sm text-gray-700 mt-1">{rv.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal phóng to ảnh */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="Zoom sản phẩm"
            className="max-w-4xl max-h-[90vh] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
