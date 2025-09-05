// src/app/api/admin/product/reject/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { productId } = await req.json();

    // Lấy token từ header
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!" },
        { status: 401 }
      );
    }

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Token không hợp lệ!" },
        { status: 401 }
      );
    }

    // Kiểm tra quyền admin
    const admin = await prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: user.id },
    });
    if (!admin || admin.vai_tro !== "admin") {
      return NextResponse.json({ message: "Không có quyền!" }, { status: 403 });
    }

    // Xóa ảnh sản phẩm trước (nếu có ràng buộc khóa ngoại)
    await prisma.san_pham_anh.deleteMany({
      where: { ma_san_pham: productId },
    });

    // Xóa sản phẩm
    await prisma.san_pham.delete({
      where: { ma_san_pham: productId },
    });

    return NextResponse.json({ message: "❌ Sản phẩm đã bị từ chối & xóa!" });
  } catch (error) {
    console.error("Reject error:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
