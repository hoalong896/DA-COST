import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function verifyToken(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "NGUOI_BAN") {
      return NextResponse.json({ message: "Không có quyền" }, { status: 403 });
    }

    // Lấy info người bán + sản phẩm
    const seller = await prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: decoded.id },
      select: {
        ma_nguoi_dung: true,
        ho_ten: true,
        email: true,
        so_dien_thoai: true,
        dia_chi: true,
        ten_cua_hang: true,
        avatar: true,
        vai_tro: true,
        san_pham: {
          select: {
            ma_san_pham: true,
            ten_san_pham: true,
            gia: true,
            so_luong_ton: true,
            ngay_dang: true,
          },
        },
      },
    });

    if (!seller) {
      return NextResponse.json({ message: "Không tìm thấy người bán" }, { status: 404 });
    }

    // Thống kê
    const totalProducts = seller.san_pham.length;
    const totalOrders = await prisma.chi_tiet_don_hang.count({
      where: { ma_nguoi_ban: decoded.id },
    });
    const revenueData = await prisma.chi_tiet_don_hang.aggregate({
      where: { ma_nguoi_ban: decoded.id },
      _sum: { thanh_tien: true },
    });

    return NextResponse.json({
      seller,
      products: seller.san_pham,
      stats: {
        totalProducts,
        totalOrders,
        revenue: revenueData._sum.thanh_tien || 0,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy seller info:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
