"use client";
import { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null);
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/thongke", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStats(data);
        else console.error(data.message);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="text-center mt-10">Đang tải thống kê...</p>;

  // Lọc chỉ 2 vai trò
  const userRoles = stats.users.filter(u => u.role === "KHACH" || u.role === "NGUOI_BAN");

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => router.push("/admin/home")}
        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow transition"
      >
        ← Quay lại trang chủ
      </button>

      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-green-600">
        Thống kê hệ thống
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sản phẩm theo danh mục */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Sản phẩm theo danh mục</h2>
          <div className="h-[250px] md:h-[300px]">
            <Bar
              data={{
                labels: stats.products.map((p) => p.category),
                datasets: [
                  {
                    label: "Số sản phẩm",
                    data: stats.products.map((p) => p.count),
                    backgroundColor: "rgba(34,197,94,0.7)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { maxRotation: 0, minRotation: 0 } }, // chữ nằm ngang
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        {/* Đơn hàng 7 ngày */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Đơn hàng 7 ngày gần nhất</h2>
          <div className="h-[250px] md:h-[300px]">
            <Line
              data={{
                labels: Object.keys(stats.orders).sort(),
                datasets: [
                  {
                    label: "Số đơn hàng",
                    data: Object.values(stats.orders).sort(),
                    borderColor: "rgba(34,197,94,0.9)",
                    backgroundColor: "rgba(34,197,94,0.3)",
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Người dùng theo vai trò */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Người dùng theo vai trò</h2>
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <Pie
              data={{
                labels: ["Khách", "Người bán"],
                datasets: [
                  {
                    label: "Số lượng",
                    data: [
                      userRoles.find(u => u.role === "KHACH")?.count || 0,
                      userRoles.find(u => u.role === "NGUOI_BAN")?.count || 0,
                    ],
                    backgroundColor: ["rgba(34,197,94,0.7)", "rgba(239,68,68,0.7)"],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
