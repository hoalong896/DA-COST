"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null); 
  const [lyDo, setLyDo] = useState("");

  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/product", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const pending = data.filter(p => p.duyet_trang_thai !== "DaDuyet");
          setProducts(pending);
        } else {
          console.error(data.message || "Lỗi load sản phẩm");
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
        alert(data.message);
        setProducts(products.filter((p) => p.ma_san_pham !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleReject = async () => {
    if (!lyDo.trim()) return alert("Vui lòng nhập lý do từ chối");
    try {
      const res = await fetch("/api/admin/product/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: rejectModal, lyDo }),
      });
      const data = await res.json();
      alert(data.message);
      setProducts(products.filter((p) => p.ma_san_pham !== rejectModal));
      setRejectModal(null);
      setLyDo("");
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Đang tải sản phẩm...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-900">
      {/* Nút quay lại */}
      <button
        onClick={() => router.push("/admin/home")}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded shadow transition flex items-center gap-2"
      >
        ← Quay lại trang chủ
      </button>

      <h1 className="text-3xl font-bold text-center mb-6 text-green-600">
        Quản lý duyệt sản phẩm
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Không có sản phẩm chờ duyệt.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.ma_san_pham}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <div className="h-48 w-full overflow-hidden">
                {p.san_pham_anh?.length > 0 ? (
                  <img
                    src={p.san_pham_anh[0].url}
                    alt={p.ten_san_pham}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    Không có ảnh
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold mb-1">{p.ten_san_pham}</h2>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{p.mo_ta}</p>
                <p className="text-green-600 font-semibold mb-4">{p.gia.toLocaleString()} VND</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(p.ma_san_pham)}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  >
                     Duyệt
                  </button>
                  <button
                    onClick={() => setRejectModal(p.ma_san_pham)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal nhập lý do từ chối */}
      {rejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nhập lý do từ chối</h2>
            <textarea
              value={lyDo}
              onChange={(e) => setLyDo(e.target.value)}
              className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
              rows="4"
              placeholder="Nhập lý do..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setRejectModal(null); setLyDo(""); }}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
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
