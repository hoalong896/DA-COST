import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where = {
      duyet_trang_thai: "DaDuyet", // 👈 chỉ lấy sản phẩm đã duyệt
    };

    if (category) {
      where.ma_danh_muc = Number(category);
    }

    const products = await prisma.san_pham.findMany({
      where,
      orderBy: { ngay_dang: "desc" }, // sắp xếp mới nhất trước
      include: {
        san_pham_anh: true,
        danh_muc: true,
      },
    });

    return NextResponse.json(
      products.map((p) => ({
        ma_san_pham: p.ma_san_pham,
        ten_san_pham: p.ten_san_pham,
        gia: p.gia,
        mo_ta: p.mo_ta,
        so_luong: p.so_luong,
        tinh_trang: p.tinh_trang,
        ten_danh_muc: p.danh_muc?.ten_danh_muc || null,
        hinh_anh: p.san_pham_anh[0]?.url || null,
      }))
    );
  } catch (error) {
    console.error("GET products list error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}
