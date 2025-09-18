import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json();
    const { phuong_thuc, tong_tien, chi_tiet, ho_ten, so_dien_thoai, dia_chi } =
      body;

    if (!tong_tien || !chi_tiet?.length) {
      return NextResponse.json(
        { message: "Không có sản phẩm hợp lệ để thanh toán" },
        { status: 400 }
      );
    }

    const donHang = await prisma.don_hang.create({
      data: {
        tong_tien: Number(tong_tien),
        trang_thai: "DaThanhToan",
        ma_nguoi_mua: payload.id,
      },
    });

    let validCount = 0;

    for (const sp of chi_tiet) {
      const maSanPham = Number(sp.ma_san_pham);
      if (!maSanPham) continue;

      const sanPham = await prisma.san_pham.findUnique({
        where: { ma_san_pham: maSanPham },
        select: { ma_nguoi_ban: true, gia: true },
      });
      if (!sanPham) continue;

      await prisma.chi_tiet_don_hang.create({
        data: {
          ma_don_hang: donHang.ma_don_hang,
          ma_san_pham: maSanPham,
          so_luong: Number(sp.so_luong) || 1,
          don_gia: Number(sp.don_gia ?? sanPham.gia),
          thanh_tien:
            (Number(sp.so_luong) || 1) * (Number(sp.don_gia) || sanPham.gia),
          ma_nguoi_ban: sanPham.ma_nguoi_ban,
        },
      });

      validCount++;
    }

    if (validCount === 0) {
      await prisma.don_hang.delete({
        where: { ma_don_hang: donHang.ma_don_hang },
      });
      return NextResponse.json(
        { message: "Không có sản phẩm hợp lệ để thanh toán" },
        { status: 400 }
      );
    }

    await prisma.thanh_toan.create({
      data: {
        ma_don_hang: donHang.ma_don_hang,
        so_tien: Number(tong_tien),
        phuong_thuc,
        trang_thai: "ThanhCong",
      },
    });

    return NextResponse.json({ message: "Đặt hàng thành công", donHang });
  } catch (err) {
    console.error("Lỗi thanh toán:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
