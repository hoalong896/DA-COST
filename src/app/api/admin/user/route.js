import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "defaultSecret";

// Middleware: giải mã token và kiểm tra admin
async function getAdminFromToken(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.role !== "Admin") return null; // chỉ admin mới được truy cập
    return decoded; // { id, role }
  } catch (err) {
    console.error("JWT verify error:", err);
    return null;
  }
}

// GET tất cả user
export async function GET(req) {
  const admin = await getAdminFromToken(req);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const users = await prisma.nguoi_dung.findMany({
      select: {
        ma_nguoi_dung: true,
        ho_ten: true,
        email: true,
        so_dien_thoai: true,
        dia_chi: true,
        vai_tro: true,
        avatar: true,
      },
      orderBy: { ma_nguoi_dung: "desc" },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error("GET users error:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

// DELETE user theo id
export async function DELETE(req) {
  const admin = await getAdminFromToken(req);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const id = parseInt(url.pathname.split("/").pop());

    if (isNaN(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    await prisma.nguoi_dung.delete({
      where: { ma_nguoi_dung: id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE user error:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
