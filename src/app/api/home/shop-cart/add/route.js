import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function verifyJwt(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "mysecret");
  } catch {
    return null;
  }
}

function getUserId(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  const payload = verifyJwt(token);
  const userId = payload?.id;
  return userId;
}

export async function POST(req) {
  try {
    const userId = getUserId(req);
    if (!userId)
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });

    const { ma_san_pham, so_luong } = await req.json();
    if (!ma_san_pham || !so_luong)
      return NextResponse.json({ message: "Thiếu thông tin" }, { status: 400 });

    let cart = await prisma.gio_hang.findFirst({
      where: { ma_nguoi_mua: userId },
    });
    if (!cart)
      cart = await prisma.gio_hang.create({ data: { ma_nguoi_mua: userId } });

    let item = await prisma.chi_tiet_gio_hang.findFirst({
      where: { ma_gio_hang: cart.ma_gio_hang, ma_san_pham },
    });

    if (item) {
      await prisma.chi_tiet_gio_hang.update({
        where: { ma_ct: item.ma_ct },
        data: { so_luong: item.so_luong + so_luong },
      });
    } else {
      await prisma.chi_tiet_gio_hang.create({
        data: { ma_gio_hang: cart.ma_gio_hang, ma_san_pham, so_luong },
      });
    }

    return NextResponse.json(
      { message: "Đã thêm vào giỏ hàng" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ POST cart error:", err);
    return NextResponse.json({ message: "Lỗi thêm giỏ hàng" }, { status: 500 });
  }
}
