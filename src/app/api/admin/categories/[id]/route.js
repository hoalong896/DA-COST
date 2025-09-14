import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const id = parseInt(params.id, 10);

  try {
    // Nếu còn con → cấm xóa
    const hasChildren = await prisma.danh_muc.findFirst({
      where: { parent_id: id },
    });

    if (hasChildren) {
      return NextResponse.json(
        { error: "Danh mục có danh mục con, không thể xóa!" },
        { status: 400 }
      );
    }

    await prisma.danh_muc.delete({
      where: { ma_danh_muc: id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
