import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sellers = await prisma.nguoi_dung.findMany({
      where: { vai_tro: "NGUOI_BAN" },
      select: {
        ma_nguoi_dung: true,
        ten_cua_hang: true,
        avatar: true,
      },
    });

    return NextResponse.json(sellers);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
