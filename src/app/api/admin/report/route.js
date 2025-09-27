import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Lấy tất cả báo cáo (Admin)
export async function GET() {
  try {
    const reports = await prisma.bao_cao.findMany({
      include: { nguoi_dung: true, san_pham: true },
      orderBy: { ngay_tao: "desc" },
    });
    return new Response(JSON.stringify(reports), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST: Tạo báo cáo mới (Người dùng)
export async function POST(req) {
  try {
    const { ma_san_pham, ma_nguoi_dung, ly_do } = await req.json();
    if (!ma_san_pham || !ma_nguoi_dung || !ly_do) {
      return new Response(JSON.stringify({ error: "Thiếu thông tin" }), { status: 400 });
    }

    const baoCao = await prisma.bao_cao.create({
      data: {
        ma_san_pham: Number(ma_san_pham),
        ma_nguoi_dung: Number(ma_nguoi_dung),
        ly_do,
      },
      include: { nguoi_dung: true, san_pham: true },
    });

    return new Response(JSON.stringify(baoCao), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// PATCH: Admin cập nhật trạng thái báo cáo
export async function PATCH(req) {
  try {
    const { ma_bao_cao, trang_thai } = await req.json();
    if (!ma_bao_cao || !trang_thai) {
      return new Response(JSON.stringify({ error: "Thiếu thông tin" }), { status: 400 });
    }

    const updated = await prisma.bao_cao.update({
      where: { ma_bao_cao: Number(ma_bao_cao) },
      data: { trang_thai },
      include: { nguoi_dung: true, san_pham: true }, // trả luôn thông tin để cập nhật table
    });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
