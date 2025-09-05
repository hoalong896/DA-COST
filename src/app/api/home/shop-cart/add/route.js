// src/app/api/home/shop-cart/add/route.js
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

export async function POST(req) {
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
    const { ma_san_pham, so_luong } = await req.json();

    // ✅ Tìm hoặc tạo giỏ hàng
    let cart = await prisma.gio_hang.findFirst({
      where: { ma_nguoi_mua: userId },
    });

    if (!cart) {
      cart = await prisma.gio_hang.create({
        data: { ma_nguoi_mua: userId },
      });
    }

    // ✅ Kiểm tra sản phẩm đã có trong giỏ
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

    // ✅ Trả về giỏ hàng mới nhất
    const updatedCart = await prisma.gio_hang.findFirst({
      where: { ma_nguoi_mua: userId },
      include: {
        chi_tiet_gio_hang: {
          include: {
            san_pham: {
              include: { san_pham_anh: true },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedCart, { status: 200 });
  } catch (err) {
    console.error("❌ Lỗi thêm vào giỏ hàng:", err);
    return NextResponse.json(
      { error: "Không thể thêm giỏ hàng" },
      { status: 500 }
    );
  }
}
