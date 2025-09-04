"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  // Cập nhật thông tin
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
        setMessage(" Cập nhật thành công!");
      } else {
        setMessage(data.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage(" Lỗi server!");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/dangnhap");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[450px] text-center">
        <h2 className="text-2xl font-bold mb-6">👤 Thông tin cá nhân</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-yellow-700 shadow-md"
          />

          {/* Chọn file */}
          <input
            type="file"
            accept="image/*"
            className="mt-3"
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

        {/* Form chỉnh sửa */}
        <div className="text-left space-y-3 mb-6">
          <div>
            <label className="font-semibold">Họ tên:</label>
            <input
              type="text"
              value={user.ho_ten || ""}
              onChange={(e) => setUser({ ...user, ho_ten: e.target.value })}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">Email:</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border px-3 py-2 rounded mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="font-semibold">Số điện thoại:</label>
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
            <label className="font-semibold">Địa chỉ:</label>
            <input
              type="text"
              value={user.dia_chi || ""}
              onChange={(e) => setUser({ ...user, dia_chi: e.target.value })}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
        </div>

        {/* Nút chức năng */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Cập nhật
          </button>

          <button
            onClick={() => router.push("/profile/chage-password")}
            className="flex-1 bg-yellow-700 text-white py-2 rounded-lg hover:bg-yellow-800"
          >
            Đổi mật khẩu
          </button>
        </div>
        <button
          onClick={() => router.push("/home2")}
          className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 mb-3"
        >
          Về trang chủ
        </button>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
        >
          Đăng xuất
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
