import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const product = await prisma.san_pham.findUnique({
      where: { ma_san_pham: Number(id) },
      include: {
        san_pham_anh: true, // ảnh sản phẩm
        danh_muc: true, // danh mục
        nguoi_dung: true, // người bán (relation trong schema)
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("API product error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
