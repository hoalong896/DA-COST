import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    const product = await prisma.san_pham.findUnique({
      where: { ma_san_pham: Number(id) },
      include: {
        san_pham_anh: true,
        danh_muc: true,
        nguoi_dung: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ma_san_pham: product.ma_san_pham,
      ten_san_pham: product.ten_san_pham,
      gia: product.gia,
      mo_ta: product.mo_ta,
      so_luong_ton: product.so_luong_ton,
      duyet_trang_thai: product.duyet_trang_thai,
      tinh_trang: product.tinh_trang,
      ngay_dang: product.ngay_dang,
      ngay_cap_nhat: product.ngay_cap_nhat,
      danh_muc: product.danh_muc,
     nguoi_ban: product.nguoi_dung
  ? {
      id: product.nguoi_dung.ma_nguoi_dung,
      ho_ten: product.nguoi_dung.ho_ten,
      email: product.nguoi_dung.email,
      avatar: product.nguoi_dung.avatar || null,
      ten_cua_hang: product.nguoi_dung.ten_cua_hang || "Chưa có tên cửa hàng",
    }
  : null,

      hinh_anh: product.san_pham_anh.map((a) => ({
        id: a.ma_anh,
        url: a.url,
        la_anh_chinh: a.la_anh_chinh,
      })),
    });
  } catch (error) {
    console.error("API product error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
