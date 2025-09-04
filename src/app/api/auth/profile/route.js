import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";
async function getUserFromToken() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: parseInt(decoded.userId) },
      select: {
        ma_nguoi_dung: true,
        ho_ten: true,
        email: true,
        so_dien_thoai: true,
        dia_chi: true,
        vai_tro: true,
        avatar: true,
      },
    });
    return user;
  } catch (err) {
    console.error("Lỗi xác thực token:", err);
    return null;
  }
}

// GET: lấy hồ sơ user
export async function GET() {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json(
      { message: "Không tìm thấy user" },
      { status: 404 }
    );
  }
  return NextResponse.json({ user });
}

// PUT: cập nhật hồ sơ
export async function PUT(req) {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const updatedUser = await prisma.nguoi_dung.update({
      where: { ma_nguoi_dung: user.ma_nguoi_dung },
      data: {
        ho_ten: body.ho_ten ?? user.ho_ten,
        so_dien_thoai: body.so_dien_thoai ?? user.so_dien_thoai,
        dia_chi: body.dia_chi ?? user.dia_chi,
        avatar: body.avatar ?? user.avatar,
      },
    });

    return NextResponse.json({
      message: "Cập nhật thành công",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
