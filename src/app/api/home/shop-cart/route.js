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

    const userId = payload.id; // hoặc payload.userId tùy lúc login bạn set

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

    return NextResponse.json(cart || { chi_tiet_gio_hang: [] });
  } catch (err) {
    console.error("❌ Lỗi GET giỏ hàng:", err);
    return NextResponse.json(
      { message: "Không thể tải giỏ hàng" },
      { status: 500 }
    );
  }
}
