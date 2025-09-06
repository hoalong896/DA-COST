import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Thiếu token" }, { status: 401 });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Token không hợp lệ" },
        { status: 403 }
      );
    }

    const { tong_tien, chi_tiet } = await req.json();

    if (!tong_tien || !chi_tiet || chi_tiet.length === 0) {
      return NextResponse.json(
        { message: "Thiếu dữ liệu đơn hàng" },
        { status: 400 }
      );
    }

    const donHang = await prisma.don_hang.create({
      data: {
        ma_nguoi_mua: payload.userId, // lấy từ token
        tong_tien,
        trang_thai: "ChoXacNhan",
        chi_tiet_don_hang: {
          create: chi_tiet.map((ct) => ({
            ma_san_pham: ct.ma_san_pham,
            so_luong: ct.so_luong,
            don_gia: ct.don_gia,
            thanh_tien: ct.so_luong * ct.don_gia,
            ma_nguoi_ban: ct.ma_nguoi_ban,
          })),
        },
      },
    });

    return NextResponse.json({
      message: "Đặt hàng thành công",
      donHang,
    });
  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
