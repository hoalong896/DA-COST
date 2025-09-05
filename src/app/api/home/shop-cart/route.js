import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// ✅ Hàm verify JWT
function verifyJwt(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "mysecret");
  } catch (err) {
    return null;
  }
}

export async function GET(req) {
  try {
    // ✅ Lấy token từ header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
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

    const userId = payload.userId; // 👈 userId từ token

    // ✅ Tìm giỏ hàng của user
    let cart = await prisma.gio_hang.findFirst({
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

    // ✅ Nếu chưa có thì tạo giỏ hàng trống
    if (!cart) {
      cart = await prisma.gio_hang.create({
        data: { ma_nguoi_mua: userId },
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
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (err) {
    console.error("❌ Lỗi GET giỏ hàng:", err);
    return NextResponse.json(
      { message: err.message || "Không thể lấy giỏ hàng" },
      { status: 500 }
    );
  }
}
