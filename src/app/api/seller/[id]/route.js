import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const seller = await prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: parseInt(id) },
      select: {
        ma_nguoi_dung: true,
        ho_ten: true,
        ten_cua_hang: true,
        dia_chi: true,
        email: true,
        so_dien_thoai: true,
        avatar: true,
        mo_ta: true,
      },
    });

    if (!seller) {
      return new Response(JSON.stringify({ error: "Người bán không tồn tại" }), { status: 404 });
    }

    const products = await prisma.san_pham.findMany({
      where: { ma_nguoi_ban: parseInt(id) },
      select: {
        ma_san_pham: true,
        ten_san_pham: true,
        gia: true,
      },
      orderBy: { ngay_dang: "desc" },
      take: 4,
    });

    return new Response(JSON.stringify({ seller, products }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Lỗi server" }), { status: 500 });
  }
}
