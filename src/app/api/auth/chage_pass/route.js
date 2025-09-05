import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Thiếu token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verify error:", err.message);
      return NextResponse.json(
        { message: "Token không hợp lệ" },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Vui lòng nhập đủ mật khẩu" },
        { status: 400 }
      );
    }

    const user = await prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: decoded.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(oldPassword, user.mat_khau);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Mật khẩu cũ không đúng" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.nguoi_dung.update({
      where: { ma_nguoi_dung: decoded.id },
      data: { mat_khau: hashedPassword },
    });

    return NextResponse.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Lỗi server!", error: error.message },
      { status: 500 }
    );
  }
}
