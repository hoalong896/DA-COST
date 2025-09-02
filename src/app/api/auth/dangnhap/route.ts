import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = "your_secret_key";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Tìm user theo email
    const user = await prisma.nguoi_dung.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Sai email hoặc mật khẩu" },
        { status: 400 }
      );
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.mat_khau);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Sai email hoặc mật khẩu" },
        { status: 400 }
      );
    }

    // Tạo JWT token (ép BigInt sang string)
    const token = jwt.sign(
      { userId: user.ma_nguoi_dung.toString() },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Trả về thông tin user (ép BigInt sang string nếu có)
    return NextResponse.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.ma_nguoi_dung.toString(),
        ho_ten: user.ho_ten,
        email: user.email,
        vai_tro: user.vai_tro,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
