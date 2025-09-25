import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: danh sách báo cáo
export async function GET() {
  try {
    const reports = await prisma.bao_cao.findMany({
      orderBy: { ngay_tao: "desc" },
      include: {
        nguoi_dung: { select: { ma_nguoi_dung: true, ho_ten: true, email: true } },
        san_pham: { select: { ma_san_pham: true, ten_san_pham: true } },
      },
    });

    return NextResponse.json({ message: "OK", data: reports });
  } catch (err) {
    console.error("GET /admin/report error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT: cập nhật trạng thái
export async function PUT(req) {
  try {
    const { id, trang_thai } = await req.json();

    const updated = await prisma.bao_cao.update({
      where: { ma_bao_cao: Number(id) },
      data: { trang_thai },
    });

    return NextResponse.json({ message: "Cập nhật thành công", data: updated });
  } catch (err) {
    console.error("PUT /admin/report error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
