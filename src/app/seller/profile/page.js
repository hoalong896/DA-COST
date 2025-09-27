"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Store, Mail, Phone, MapPin, Star, MessageCircle, Question } from "lucide-react";

export default function SellerProfilePage({ params }) {
  const { id } = params;
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchSeller = async () => {
      try {
        const res = await fetch(`/api/seller/${id}`);
        const data = await res.json();

        if (res.ok) {
          setSeller(data.seller);
          setProducts(data.products);
        } else {
          console.error(data.message || data.error);
          setSeller(null);
        }
      } catch (err) {
        console.error("Error fetch seller:", err);
        setSeller(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [id]);

  if (loading) return <p className="p-6 animate-pulse"> Đang tải thông tin...</p>;
  if (!seller) return <p className="p-6 text-red-500">Không tìm thấy người bán.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-8">
      {/* Header thông tin shop */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between border mb-12 gap-6"
      >
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          {seller.avatar ? (
            <img src={seller.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow border" />
          ) : (
            <div className="bg-yellow-600 text-white w-24 h-24 flex items-center justify-center rounded-full text-3xl font-bold shadow">
              {seller.ten_cua_hang?.[0] || "?"}
            </div>
          )}

          {/* Thông tin */}
          <div>
            <h1 className="text-3xl font-bold text-yellow-700 flex items-center space-x-2">
              <Store size={26} /> <span>{seller.ten_cua_hang}</span>
            </h1>
            <p className="text-gray-600 mt-2">{seller.mo_ta || "Người bán chưa cập nhật mô tả."}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-gray-700 text-sm">
              {seller.so_dien_thoai && <span className="flex items-center gap-1"><Phone size={16} /> {seller.so_dien_thoai}</span>}
              {seller.email && <span className="flex items-center gap-1"><Mail size={16} /> {seller.email}</span>}
              {seller.dia_chi && <span className="flex items-center gap-1"><MapPin size={16} /> {seller.dia_chi}</span>}
            </div>
          </div>
        </div>

        {/* Nút nhắn tin */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
          onClick={() => (window.location.href = `/chat/${id}`)}
        >
          <MessageCircle size={20} /> <span>Nhắn với người bán</span>
        </motion.button>
      </motion.div>

      {/* Sản phẩm nổi bật */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
          <Star size={20} /> <span>Sản phẩm nổi bật</span>
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <motion.div
                key={p.ma_san_pham}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow p-4 border cursor-pointer hover:shadow-xl transition"
              >
                <p className="font-semibold text-gray-800">{p.ten_san_pham}</p>
                <p className="text-yellow-600 font-bold">{p.gia.toLocaleString()} đ</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Người bán chưa có sản phẩm nào.</p>
        )}
      </section>
    </div>
  );
}
