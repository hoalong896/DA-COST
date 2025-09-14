import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function verifyJwt(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "mysecret");
  } catch {
    return null;
  }
}

// ✅ Cập nhật số lượng
export async function PUT(req, context) {
  try {
    const { id } = await context.params; // 👈 phải await
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload)
      return NextResponse.json(
        { message: "Token không hợp lệ" },
        { status: 403 }
      );

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "Body rỗng" }, { status: 400 });
    }

    const { so_luong } = body;
    if (!so_luong || so_luong < 1) {
      return NextResponse.json(
        { message: "Số lượng không hợp lệ" },
        { status: 400 }
      );
    }

    const updated = await prisma.chi_tiet_gio_hang.update({
      where: { ma_ct: Number(id) },
      data: { so_luong },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(" Lỗi PUT giỏ hàng:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

// ✅ Xóa sản phẩm
export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload)
      return NextResponse.json(
        { message: "Token không hợp lệ" },
        { status: 403 }
      );

    await prisma.chi_tiet_gio_hang.delete({
      where: { ma_ct: Number(id) },
    });

    return NextResponse.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error(" Lỗi DELETE giỏ hàng:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
