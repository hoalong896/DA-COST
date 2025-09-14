import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: lấy toàn bộ danh mục cha + con
export async function GET() {
  try {
    const categories = await prisma.danh_muc.findMany({
      where: { parent_id: null },
      include: {
        children: {
          include: { children: true }, // load sâu 2 cấp
        },
      },
      orderBy: { ma_danh_muc: "asc" },
    });

    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: thêm mới
export async function POST(req) {
  try {
    const { ten_danh_muc, mo_ta, parent_id } = await req.json();

    const newCategory = await prisma.danh_muc.create({
      data: {
        ten_danh_muc,
        mo_ta: mo_ta || "",
        parent_id: parent_id || null,
      },
    });

    return NextResponse.json(newCategory);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
