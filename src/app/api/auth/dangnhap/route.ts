import { NextResponse } from "next/server";
//import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Lấy user theo email
    const [rows] = await pool.query(
      "SELECT * FROM nguoi_dung WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Email không tồn tại" },
        { status: 400 }
      );
    }

    const user = rows[0];

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.mat_khau);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Mật khẩu không đúng" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Đăng nhập thành công",
      user: {
        id: user.ma_nguoi_dung,
        ho_ten: user.ho_ten,
        email: user.email,
        vai_tro: user.vai_tro,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
