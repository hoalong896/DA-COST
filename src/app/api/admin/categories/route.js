import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { ten_danh_muc, mo_ta } = body;

    if (!ten_danh_muc || ten_danh_muc.trim() === "") {
      return NextResponse.json(
        { error: "Tên danh mục không hợp lệ" },
        { status: 400 }
      );
    }

    const category = await prisma.danh_muc.create({
      data: {
        ten_danh_muc: ten_danh_muc.trim(),
        mo_ta: mo_ta || null,
        hien_thi: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
    return NextResponse.json(
      { error: "Lỗi server khi thêm danh mục", detail: error.message },
      { status: 500 }
    );
  }
}
