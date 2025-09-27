"use client";
import { useEffect, useState } from "react";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/report")
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (ma_bao_cao, newStatus) => {
    try {
      const res = await fetch("/api/admin/report", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ma_bao_cao, trang_thai: newStatus }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");

      const updated = await res.json();
      setReports((prev) =>
        prev.map((r) => (r.ma_bao_cao === ma_bao_cao ? updated : r))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Đang tải báo cáo...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách báo cáo</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Người dùng</th>
            <th className="border px-2 py-1">Sản phẩm</th>
            <th className="border px-2 py-1">Lý do</th>
            <th className="border px-2 py-1">Trạng thái</th>
            <th className="border px-2 py-1">Ngày tạo</th>
            <th className="border px-2 py-1">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.ma_bao_cao}>
              <td className="border px-2 py-1">{r.nguoi_dung.ho_ten}</td>
              <td className="border px-2 py-1">{r.san_pham.ten_san_pham}</td>
              <td className="border px-2 py-1">{r.ly_do}</td>
              <td className="border px-2 py-1">{r.trang_thai}</td>
              <td className="border px-2 py-1">{new Date(r.ngay_tao).toLocaleString()}</td>
              <td className="border px-2 py-1 space-x-2">
                {r.trang_thai !== "DangXuLy" && (
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    onClick={() => updateStatus(r.ma_bao_cao, "DangXuLy")}
                  >
                    Đang xử lý
                  </button>
                )}
                {r.trang_thai !== "DaXuLy" && (
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    onClick={() => updateStatus(r.ma_bao_cao, "DaXuLy")}
                  >
                    Đã xử lý
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
