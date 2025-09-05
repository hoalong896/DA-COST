import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.danh_muc.findMany({
      orderBy: { ngay_tao: "desc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Lỗi GET categories:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh mục" },
      { status: 500 }
    );
  }
}
