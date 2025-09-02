import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { ho_ten, email, mat_khau } = await req.json();

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await prisma.nguoi_dung.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã tồn tại" },
        { status: 400 }
      );
    }

    // Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    // Tạo user mới
    const user = await prisma.nguoi_dung.create({
      data: {
        ho_ten,
        email,
        mat_khau: hashedPassword,
        vai_tro: "Khach",
      },
    });

    return NextResponse.json({ message: "Đăng ký thành công", user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
