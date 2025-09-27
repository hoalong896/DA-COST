import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/seller/[id]
export async function GET(req, context) {
  try {
    const { id } = context.params; // Lấy id từ URL
    const sellerId = Number(id);

    if (isNaN(sellerId)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // Lấy thông tin người bán + sản phẩm
    const seller = await prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: sellerId },
      select: {
        ma_nguoi_dung: true,
        ho_ten: true,
        email: true,
        so_dien_thoai: true,
        dia_chi: true,
        ten_cua_hang: true,
        avatar: true,
        mo_ta: true,
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

    return NextResponse.json({
      seller,
      products: seller.san_pham || [],
    }, { status: 200 });

  } catch (error) {
    console.error("Lỗi lấy seller info:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
