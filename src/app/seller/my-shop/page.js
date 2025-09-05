"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

export default function MyShopPage() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      router.push("/dangnhap");
      return;
    }

    if (role !== "NGUOI_BAN") {
      alert("Chỉ người bán mới vào được gian hàng!");
      router.push("/home2");
      return;
    }

    const fetchData = async () => {
      try {
        const resUser = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataUser = await resUser.json();
        if (resUser.ok) {
          setUser(dataUser.user);
        } else {
          router.push("/dangnhap");
          return;
        }

        const resProducts = await fetch("/api/seller/my-shop", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataProducts = await resProducts.json();
        if (resProducts.ok) {
          setProducts(dataProducts);
        } else {
          console.error("Lỗi lấy sản phẩm:", dataProducts);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        router.push("/dangnhap");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("Bạn có chắc muốn xoá sản phẩm này?")) return;

    const res = await fetch(`/api/seller/my-shop?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setProducts((prev) => prev.filter((sp) => sp.id !== id));
    } else {
      const err = await res.json();
      alert(err.message || "Xoá thất bại");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Đang tải dữ liệu shop...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        {/* Thông tin shop */}
        <h2 className="text-3xl font-bold mb-6 text-center">
          Gian hàng của tôi
        </h2>
        {user && (
          <div className="mb-8 text-center">
            <p className="text-lg">
              <span className="font-semibold"> Chủ shop:</span> {user.ho_ten}
            </p>
            <p className="text-lg">
              <span className="font-semibold"> Email:</span> {user.email}
            </p>
          </div>
        )}

        {/* Nút thêm sản phẩm */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => router.push("/seller/my-shop/add")}
            className="flex items-center space-x-2 bg-green-500 text-white px-5 py-2 rounded-xl hover:bg-green-600 transition shadow"
          >
            <PlusCircle size={20} />
            <span>Thêm sản phẩm</span>
          </button>
          <button
            onClick={() => router.push("/home2")}
            className="flex items-center space-x-2 bg-gray-400 text-white px-5 py-2 rounded-xl hover:bg-gray-500 transition shadow"
          >
            <span>Quay lại</span>
          </button>
        </div>

        {/* Danh sách sản phẩm */}
        <h3 className="text-xl font-semibold mb-4"> Danh sách sản phẩm</h3>
        {products.length === 0 ? (
          <p className="text-gray-500 italic">
            Chưa có sản phẩm nào trong gian hàng.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((sp) => (
              <div
                key={sp.id}
                className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
              >
                <div className="relative">
                  <img
                    src={sp.hinh_anh || "/no-image.png"}
                    alt={sp.ten_san_pham}
                    className="w-full h-48 object-cover"
                  />
                  <span
                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      sp.duyet_trang_thai === "DaDuyet"
                        ? "bg-green-100 text-green-700"
                        : sp.duyet_trang_thai === "TuChoi"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {sp.duyet_trang_thai}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-1 line-clamp-1">
                    {sp.ten_san_pham}
                  </h4>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {sp.mo_ta || "Không có mô tả"}
                  </p>
                  <p className="text-blue-600 font-semibold mb-3">
                    {sp.gia.toLocaleString()} đ
                  </p>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/seller/my-shop/edit/${sp.id}`)
                      }
                      className="flex-1 flex items-center justify-center bg-blue-500 text-white py-1.5 rounded-lg hover:bg-blue-600 transition"
                    >
                      <Edit size={16} />
                      <span className="ml-1">Sửa</span>
                    </button>
                    {sp.duyet_trang_thai === "ChoDuyet" && (
                      <button
                        onClick={() => deleteProduct(sp.id)}
                        className="flex-1 flex items-center justify-center bg-red-500 text-white py-1.5 rounded-lg hover:bg-red-600 transition"
                      >
                        <Trash2 size={16} />
                        <span className="ml-1">Xoá</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
