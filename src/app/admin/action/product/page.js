"use client";
import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null); // sản phẩm đang từ chối
  const [lyDo, setLyDo] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const adminId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/product", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Lỗi load sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch("/api/admin/product/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.message);
        setProducts(products.filter((p) => p.ma_san_pham !== id));
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch("/api/admin/product/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: rejectModal }),
      });
      const data = await res.json();
      alert(data.message);
      setProducts(products.filter((p) => p.ma_san_pham !== rejectModal));
      setRejectModal(null);
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải sản phẩm...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-2xl font-bold text-center mb-6 text-red-600">
        Quản lý duyệt sản phẩm
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">
          Không có sản phẩm chờ duyệt.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.ma_san_pham}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              {/* ✅ Hiển thị ảnh nếu có */}
              {p.san_pham_anh?.length > 0 && (
                <img
                  src={p.san_pham_anh[0].url}
                  alt={p.ten_san_pham}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h2 className="text-lg font-bold">{p.ten_san_pham}</h2>
              <p className="text-gray-600">{p.mo_ta}</p>
              <p className="text-green-600 font-semibold">{p.gia} VND</p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleApprove(p.ma_san_pham)}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  ✅ Duyệt
                </button>
                <button
                  onClick={() => setRejectModal(p.ma_san_pham)}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  ❌ Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal nhập lý do từ chối */}
      {rejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Nhập lý do từ chối</h2>
            <textarea
              value={lyDo}
              onChange={(e) => setLyDo(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              rows="3"
              placeholder="Nhập lý do..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRejectModal(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
