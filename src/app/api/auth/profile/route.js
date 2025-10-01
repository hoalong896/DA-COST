import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "123456";

async function getUserFromToken(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded; // { id: ... }
  } catch (err) {
    console.error("JWT verify error:", err);
    return null;
  }
}

// 📌 Lấy thông tin user
export async function GET(req) {
  try {
    const decoded = await getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json(
        { message: "Token không hợp lệ!" },
        { status: 401 }
      );
    }

    const user = await prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: decoded.id },
      select: {
        ma_nguoi_dung: true,
        ho_ten: true,
        email: true,
        so_dien_thoai: true,
        dia_chi: true,
        vai_tro: true,
        avatar: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("GET profile error:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

// 📌 Cập nhật thông tin user
export async function PUT(req) {
  try {
    const decoded = await getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json(
        { message: "Token không hợp lệ!" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const updatedUser = await prisma.nguoi_dung.update({
      where: { ma_nguoi_dung: decoded.id },
      data: {
        ho_ten: body.ho_ten,
        so_dien_thoai: body.so_dien_thoai,
        dia_chi: body.dia_chi,
        avatar: body.avatar,
      },
      select: {
        ma_nguoi_dung: true,
        ho_ten: true,
        email: true,
        so_dien_thoai: true,
        dia_chi: true,
        vai_tro: true,
        avatar: true,
      },
    });

    return NextResponse.json({
      message: "Cập nhật thành công",
      user: updatedUser,
    });
  } catch (err) {
    console.error("PUT profile error:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
