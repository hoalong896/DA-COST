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
    if (!admin || admin.vai_tro !== "Admin") {
      return NextResponse.json(
        { message: "Không có quyền duyệt!" },
        { status: 403 }
      );
    }

    // ✅ Cập nhật trạng thái thành "DaDuyet" (không phải TuChoi)
    await prisma.san_pham.update({
      where: { ma_san_pham: productId },
      data: { duyet_trang_thai: "DaDuyet", ngay_cap_nhat: new Date() },
    });

    return NextResponse.json({
      message: "Sản phẩm đã được duyệt thành công ✅",
    });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
  }
}
