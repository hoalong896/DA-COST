import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "defaultSecret";

// ✅ Kiểm tra admin token
async function getAdminFromToken(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.role !== "Admin") return null;
    return decoded; // { id, role }
  } catch (err) {
    console.error("JWT verify error:", err);
    return null;
  }
}

export async function DELETE(req) {
  const admin = await getAdminFromToken(req);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const urlParts = req.url.split("/");
    const id = parseInt(urlParts[urlParts.length - 1]);
    if (isNaN(id)) return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 });

    const userToDelete = await prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: id },
    });

    if (!userToDelete) return NextResponse.json({ message: "Người dùng không tồn tại" }, { status: 404 });
    if (userToDelete.vai_tro === "Admin")
      return NextResponse.json({ message: "Không thể xóa Admin" }, { status: 403 });

    // Kiểm tra user còn sản phẩm/đơn hàng không
    const hasProducts = await prisma.san_pham.findFirst({ where: { ma_nguoi_ban: id } });
    const hasOrders = await prisma.don_hang.findFirst({ where: { ma_nguoi_mua: id } });

    if (hasProducts || hasOrders) {
      return NextResponse.json(
        { message: "Người dùng này đang có sản phẩm hoặc đơn hàng, không thể xóa" },
        { status: 400 }
      );
    }

    // Xóa user
    await prisma.nguoi_dung.delete({ where: { ma_nguoi_dung: id } });
    return NextResponse.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error("DELETE user error:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
