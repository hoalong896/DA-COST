import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Vui lòng nhập email và mật khẩu" },
        { status: 400 }
      );
    }

    const user = await prisma.nguoi_dung.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "Sai email hoặc mật khẩu" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.mat_khau);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Sai email hoặc mật khẩu" },
        { status: 400 }
      );
    }

    // 🔥 Gắn cả role vào token
    const token = jwt.sign(
      {
        id: user.ma_nguoi_dung,
        role: user.vai_tro, // ví dụ: "admin" hoặc "user"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.ma_nguoi_dung,
        ho_ten: user.ho_ten,
        email: user.email,
        so_dien_thoai: user.so_dien_thoai,
        dia_chi: user.dia_chi,
        vai_tro: user.vai_tro,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
