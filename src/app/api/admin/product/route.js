import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Lấy query param status (?status=ChoDuyet)
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let where = {};
    if (status) {
      where.duyet_trang_thai = status; // Lọc theo trạng thái
    }

    // app/api/admin/products/route.js
    const products = await prisma.san_pham.findMany({
      where,
      include: {
        san_pham_anh: true, // lấy danh sách ảnh
      },
      orderBy: { ngay_dang: "desc" },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error("API GET /admin/products error:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
