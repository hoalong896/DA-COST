"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  List,
  Eye,
  Bell,
  User,
  LogOut,
  ShoppingCart,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/dangnhap");
          return;
        }
        const res = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          router.push("/dangnhap");
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        router.push("/dangnhap");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  // Update profile
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setMessage("Cập nhật thành công!");
      } else {
        setMessage(data.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("Lỗi server!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/dangnhap");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 animate-pulse">Đang tải...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-6 flex flex-col justify-between shadow-md">
        <div>
          <h2 className="text-lg font-semibold mb-6">Quản lý tài khoản</h2>
          <nav className="space-y-4">
            <a className="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer">
              <ShoppingCart size={18} /> Giỏ hàng
            </a>

            <a className="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer">
              <Bell size={18} /> Thông báo
            </a>
            <a className="flex items-center gap-2 text-yellow-600 font-semibold cursor-pointer">
              <User size={18} /> Tài khoản
            </a>
          </nav>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div>
              <p className="font-medium">{user.ho_ten || "Người dùng"}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 mt-3"
          >
            <LogOut size={18} /> Thoát
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        <h2 className="text-2xl font-bold mb-2">Tài khoản</h2>
        <p className="text-gray-600 mb-6">Cập nhật thông tin tài khoản</p>

        <div className="grid grid-cols-3 gap-8">
          {/* Form */}
          <div className="col-span-2 space-y-5">
            <div>
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border px-3 py-2 rounded mt-1 bg-gray-100"
              />
            </div>

            <div>
              <label className="block font-semibold">Tên hiển thị</label>
              <input
                type="text"
                value={user.ho_ten || ""}
                onChange={(e) => setUser({ ...user, ho_ten: e.target.value })}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </div>

            <div>
              <label className="block font-semibold">Số điện thoại</label>
              <input
                type="text"
                value={user.so_dien_thoai || ""}
                onChange={(e) =>
                  setUser({ ...user, so_dien_thoai: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </div>

            <div>
              <label className="block font-semibold">Địa chỉ</label>
              <input
                type="text"
                value={user.dia_chi || ""}
                onChange={(e) => setUser({ ...user, dia_chi: e.target.value })}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </div>

            <div className="flex gap-6">
              {" "}
              {/* khoảng cách giữa 2 nút */}
              <button
                onClick={handleUpdate}
                className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 rounded font-semibold text-white"
              >
                Cập nhật
              </button>
              <button
                onClick={() => router.push("/home2")}
                className="px-10 py-2 bg-blue-500 hover:bg-orange-600 rounded font-semibold text-white"
              >
                Quay lại
              </button>
            </div>

            <p className="text-sm mt-3">
              Đổi mật khẩu, nhấn vào{" "}
              <span
                onClick={() => router.push("/profile/change-password")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                đây
              </span>
            </p>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border"
            />
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                try {
                  const res = await fetch("/api/auth/upload_image", {
                    method: "POST",
                    body: formData,
                  });

                  const data = await res.json();
                  if (res.ok) {
                    setUser({ ...user, avatar: data.url });
                    setMessage("Upload ảnh thành công!");
                  } else {
                    setMessage(data.message || "Upload ảnh thất bại!");
                  }
                } catch (err) {
                  console.error("Upload error:", err);
                  setMessage("Lỗi server khi upload ảnh!");
                }
              }}
            />
          </div>
        </div>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </main>
    </div>
  );
}
