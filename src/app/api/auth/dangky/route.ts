import { NextResponse } from "next/server";
//import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { ho_ten, email, mat_khau } = await req.json();

    // Kiểm tra email đã tồn tại chưa
    const [rows] = await pool.query(
      "SELECT * FROM nguoi_dung WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      return NextResponse.json({ error: "Email đã tồn tại" }, { status: 400 });
    }

    // Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    // Thêm user mới
    await pool.query(
      "INSERT INTO nguoi_dung (ho_ten, email, mat_khau) VALUES (?, ?, ?)",
      [ho_ten, email, hashedPassword]
    );

    return NextResponse.json({ message: "Đăng ký thành công!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
