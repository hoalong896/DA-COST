"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // State đánh giá
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([
    { user: "nguoidung1", rating: 5, comment: "Sản phẩm rất tốt!" },
    {
      user: "nguoidung2",
      rating: 4,
      comment: "Giao hàng nhanh, chất lượng ổn.",
    },
    { user: "nguoidung3", rating: 3, comment: "Tạm được, còn cải thiện." },
  ]);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/home/product/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
        } else {
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

  if (loading) return <p className="p-6">Đang tải chi tiết sản phẩm...</p>;
  if (!product) return <p className="p-6">Không tìm thấy sản phẩm.</p>;

  const handleReport = () => {
    alert("Bạn đã báo cáo sản phẩm này. Admin sẽ kiểm tra!");
  };

  const handleSubmitReview = () => {
    if (!rating || !comment) {
      alert("Vui lòng chọn số sao và nhập bình luận!");
      return;
    }
    const newReview = { user: "Bạn", rating, comment };
    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment("");
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen text-black">
      {/* Nút điều hướng */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => router.push("/home2")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ⬅ Thoát
        </button>
        <button
          onClick={handleReport}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          🚨 Báo cáo sản phẩm
        </button>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <div className="flex gap-6">
          {/* Ảnh sản phẩm */}
          <div className="w-1/3">
            <img
              src={product.san_pham_anh?.[0]?.url || "/placeholder.png"}
              alt={product.ten_san_pham}
              className="w-full h-64 object-cover rounded"
            />
          </div>

          {/* Chi tiết */}
          <div className="flex-1 space-y-3">
            <h1 className="text-2xl font-bold">{product.ten_san_pham}</h1>
            <p>
              <b>Giá:</b> {product.gia} VND
            </p>
            <p>
              <b>Mô tả:</b> {product.mo_ta}
            </p>
            <p>
              <b>Người bán:</b> {product.nguoi_dung?.ho_ten || "Không rõ"}
            </p>
            <p>
              <b>Số lượng:</b> {product.so_luong_ton ?? 0}
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

            {/* Nút */}
            <div className="flex gap-4 mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={product.so_luong_ton <= 0}
              >
                Thêm vào giỏ hàng
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                disabled={product.so_luong_ton <= 0}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin shop */}
      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          {/* Avatar người bán */}
          <img
            src={product.nguoi_dung?.avatar || "/default-avatar.png"}
            alt="Avatar người bán"
            className="w-16 h-16 rounded-full object-cover border border-gray-300"
          />

          <div className="flex-1">
            <h2 className="text-lg font-bold">
              {product.nguoi_dung?.ho_ten || "Người bán"}
            </h2>
            <p className="text-sm text-gray-600">
              Email: {product.nguoi_dung?.email || "Chưa có email"}
            </p>
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-200">
              Liên hệ
            </button>
            <button className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-200">
              Xem Shop
            </button>
          </div>
        </div>
      </div>

      {/* Đánh giá + Bình luận */}
      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="font-bold mb-3">Đánh giá chất lượng sản phẩm</h3>

        {/* Rating sao */}
        <div className="flex mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer text-2xl ${
                star <= rating ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Nhập bình luận */}
        <textarea
          className="w-full border border-gray-300 rounded p-2 mb-3 bg-white text-black"
          rows="3"
          placeholder="Bình luận"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        {/* Nút gửi */}
        <button
          onClick={handleSubmitReview}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
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
              className="flex items-start gap-3 p-3 bg-white rounded border"
            >
              {/* Avatar */}
              <img
                src="/default-avatar.png"
                alt="user avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold">{rv.user}</p>
                <p className="text-yellow-500">
                  {"★".repeat(rv.rating)}
                  <span className="text-gray-400">
                    {"★".repeat(5 - rv.rating)}
                  </span>
                </p>
                <p className="text-sm text-gray-700 mt-1">{rv.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
