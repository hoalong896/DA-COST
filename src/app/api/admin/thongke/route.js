import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware kiểm tra token admin
async function getUserFromToken(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const jwt = await import("jsonwebtoken");
    return jwt.verify(token, process.env.JWT_SECRET || "defaultSecret");
  } catch {
    return null;
  }
}

export async function GET(req) {
  const decoded = await getUserFromToken(req);
  if (!decoded || decoded.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Thống kê số sản phẩm theo danh mục
    const productsByCategory = await prisma.danh_muc.findMany({
      select: {
        ten_danh_muc: true,
        san_pham: { select: { ma_san_pham: true } },
      },
    });

    const productStats = productsByCategory.map((c) => ({
      category: c.ten_danh_muc,
      count: c.san_pham.length,
    }));

    // 2. Thống kê số đơn hàng theo ngày (7 ngày gần nhất)
    const orders = await prisma.don_hang.findMany({
      where: {
        ngay_dat: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      select: { ngay_dat: true },
    });

    const ordersByDay = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      ordersByDay[key] = 0;
    }
    orders.forEach((o) => {
      const key = o.ngay_dat.toISOString().split("T")[0];
      if (ordersByDay[key] !== undefined) ordersByDay[key]++;
    });

    // 3. Thống kê số người dùng theo vai trò
    const users = await prisma.nguoi_dung.groupBy({
      by: ["vai_tro"],
      _count: { ma_nguoi_dung: true },
    });

    return NextResponse.json({
      products: productStats,
      orders: ordersByDay,
      users: users.map((u) => ({ role: u.vai_tro, count: u._count.ma_nguoi_dung })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
