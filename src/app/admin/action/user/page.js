"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminUserPage() {
  const router = useRouter(); 
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/admin/user", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Bạn chưa đăng nhập admin!");

    const res = await fetch(`/api/admin/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setUsers(users.filter(u => u.ma_nguoi_dung !== id));
    } else {
      const data = await res.json();
      alert(data.message || "Xóa thất bại!");
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users
        .filter(u => u.vai_tro !== "Admin") 
        .filter(
          u =>
            u.ho_ten.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
    : [];

  const roleLabel = (role) => {
    if (role === "KHACH") return "Khách";
    if (role === "NGUOI_BAN") return "Người bán";
    return role; 
  };

  return (
    <div className="p-6">
      <button
        onClick={() => router.push("/admin/home")}
        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow transition"
      >
        ← Quay lại trang chủ
      </button>

      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>

      <input
        type="text"
        placeholder="Tìm kiếm theo tên hoặc email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Avatar</th>
              <th className="px-4 py-2 text-left">Tên</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Vai trò</th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.ma_nguoi_dung} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.ho_ten}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">?</div>
                  )}
                </td>
                <td className="px-4 py-2">{user.ho_ten}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{roleLabel(user.vai_tro)}</td>
                <td className="px-4 py-2 space-x-2">
              
                  <button
                    onClick={() => handleDelete(user.ma_nguoi_dung)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">Không có người dùng</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
