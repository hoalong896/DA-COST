import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    const user = await prisma.nguoi_dung.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpire: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token không hợp lệ hoặc đã hết hạn!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.nguoi_dung.update({
      where: { ma_nguoi_dung: user.ma_nguoi_dung }, // ✅ dùng đúng khóa chính
      data: {
        mat_khau: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    });

    return NextResponse.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
