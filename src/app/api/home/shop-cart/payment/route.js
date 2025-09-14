import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // 🔑 Lấy token từ header
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 📌 Lấy dữ liệu từ body
    const body = await req.json();
    const { phuong_thuc, tong_tien, chi_tiet, ho_ten, so_dien_thoai, dia_chi } =
      body;

    if (!tong_tien || !chi_tiet?.length) {
      return NextResponse.json(
        { message: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    // 🛒 Tạo đơn hàng
    const donHang = await prisma.don_hang.create({
      data: {
        tong_tien: Number(tong_tien), // ✅ ép về số
        trang_thai: "ChoXacNhan",
        ma_nguoi_mua: payload.id, // field trong schema
      },
    });

    // 📦 Tạo chi tiết đơn hàng
    for (const sp of chi_tiet) {
      // ✅ Lấy sản phẩm trong DB để đảm bảo tồn tại + có người bán
      const sanPham = await prisma.san_pham.findUnique({
        where: { ma_san_pham: sp.ma_san_pham },
        select: { ma_nguoi_ban: true, gia: true },
      });

      if (!sanPham) {
        throw new Error(`Sản phẩm ${sp.ma_san_pham} không tồn tại`);
      }

      await prisma.chi_tiet_don_hang.create({
        data: {
          ma_don_hang: donHang.ma_don_hang,
          ma_san_pham: sp.ma_san_pham,
          so_luong: sp.so_luong,
          don_gia: sp.don_gia ?? sanPham.gia,
          thanh_tien: sp.so_luong * (sp.don_gia ?? sanPham.gia),
          ma_nguoi_ban: sanPham.ma_nguoi_ban, // ✅ luôn chính xác
        },
      });
    }

    // 💳 Tạo thanh toán
    await prisma.thanh_toan.create({
      data: {
        ma_don_hang: donHang.ma_don_hang,
        so_tien: Number(tong_tien), // ✅ ép số
        phuong_thuc,
        trang_thai: "ChoXuLy",
      },
    });

    return NextResponse.json({
      message: "Đặt hàng thành công",
      donHang,
    });
  } catch (err) {
    console.error("Lỗi thanh toán:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
