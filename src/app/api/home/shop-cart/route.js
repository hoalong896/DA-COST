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

export async function GET(req) {
  try {
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

    const userId = payload.id;

    const cart = await prisma.gio_hang.findFirst({
      where: { ma_nguoi_mua: userId },
      include: {
        chi_tiet_gio_hang: {
          include: {
            san_pham: { include: { san_pham_anh: true } },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ chi_tiet_gio_hang: [] });
    }

    const mappedCart = {
      ...cart,
      chi_tiet_gio_hang: cart.chi_tiet_gio_hang.map((ct) => ({
        ma_ct: ct.ma_ct,
        so_luong: ct.so_luong,
        ngay_tao: ct.ngay_tao,
        san_pham: {
          id: ct.san_pham.ma_san_pham,
          ten_san_pham: ct.san_pham.ten_san_pham,
          gia: ct.san_pham.gia,
          tinh_trang: ct.san_pham.tinh_trang,
          san_pham_anh: ct.san_pham.san_pham_anh || [],
        },
      })),
    };

    return NextResponse.json(mappedCart);
  } catch (err) {
    console.error("Lỗi GET giỏ hàng:", err);
    return NextResponse.json(
      { message: "Không thể tải giỏ hàng" },
      { status: 500 }
    );
  }
}
