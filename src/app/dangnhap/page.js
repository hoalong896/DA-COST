"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLoading } from "../components/LoadingProvider";
export default function DangNhapPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successLoading, setSuccessLoading] = useState(false); // loading sau khi login thành công
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/dangnhap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.vai_tro);
        setMessage("Đăng nhập thành công!");
        setSuccessLoading(true);

        setTimeout(() => {
          if (data.user.vai_tro === "Admin") {
            router.push("/admin/home");
          } else {
            router.push("/home2");
          }
        }, 1500);
      } else {
        setMessage(data.message || data.error || " Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(" Lỗi kết nối server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-96 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <a href="/home">
            <Image src="/logo.png" alt="OBG Logo" width={60} height={60} />
          </a>
        </div>

        {/* Tiêu đề */}
        <h2 className="text-xl font-semibold mb-4 text-yellow-700">LOGIN</h2>
        <p className="text-sm text-black mb-6">Sign in to your account</p>

        {successLoading ? (
          <p className="text-yellow-700 font-semibold">Đang đăng nhập ...</p>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-black rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-black rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-yellow-700 text-white py-2 rounded-md font-semibold disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Login"}
            </button>
          </form>
        )}

        {/* Thông báo */}
        {message && !successLoading && (
          <p
            className={`mt-4 ${
              message.includes("thành công") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Links */}
        {!successLoading && (
          <>
            <p className="text-sm text-gray-500 mt-4">
              I forgot my password.{" "}
              <a
                href="/profile/forgot-password"
                className="text-yellow-700 hover:underline"
              >
                Click here
              </a>{" "}
              to reset.
            </p>

            <p className="text-sm text-gray-500 mt-2">
              <a href="/dangky" className="text-gray-700 font-semibold">
                Register new account
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
