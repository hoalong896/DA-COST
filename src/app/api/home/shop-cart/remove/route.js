// src/app/api/home/shop-cart/remove/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient(); // 👈 bổ sung Prisma client

function verifyJwt(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "mysecret");
  } catch {
    return null;
  }
}

export async function DELETE(req) {
  try {
    // ✅ Lấy token từ header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json(
        { message: "Token không hợp lệ" },
        { status: 403 }
      );
    }
    const userId = payload.userId;

    // ✅ Lấy dữ liệu từ body
    const { ma_ct } = await req.json();
    if (!ma_ct) {
      return NextResponse.json({ error: "Thiếu mã chi tiết" }, { status: 400 });
    }

    // ✅ Kiểm tra item có thuộc giỏ của user không
    const item = await prisma.chi_tiet_gio_hang.findUnique({
      where: { ma_ct },
      include: { gio_hang: true },
    });

    if (!item || item.gio_hang.ma_nguoi_mua !== userId) {
      return NextResponse.json(
        { error: "Không có quyền xóa" },
        { status: 403 }
      );
    }

    // ✅ Xóa sản phẩm
    await prisma.chi_tiet_gio_hang.delete({ where: { ma_ct } });

    // ✅ Trả về giỏ hàng mới nhất
    const updatedCart = await prisma.gio_hang.findFirst({
      where: { ma_nguoi_mua: userId },
      include: {
        chi_tiet_gio_hang: {
          include: {
            san_pham: { include: { san_pham_anh: true } },
          },
        },
      },
    });

    return NextResponse.json(updatedCart, { status: 200 });
  } catch (err) {
    console.error("❌ Lỗi remove:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
