import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData();

    const ten_san_pham = formData.get("ten_san_pham");
    const gia = parseFloat(formData.get("gia"));
    const mo_ta = formData.get("mo_ta");
    const ma_danh_muc = parseInt(formData.get("ma_danh_muc") || 1);
    const so_luong_ton = parseInt(formData.get("so_luong_ton") || "0");
    const file = formData.get("image");

    if (!ten_san_pham || isNaN(gia) || isNaN(so_luong_ton)) {
      return NextResponse.json({ message: "Thiếu dữ liệu!" }, { status: 400 });
    }

    // 🔑 Lấy token từ header
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!" },
        { status: 401 }
      );
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "123456");
      userId = decoded.id;
    } catch {
      return NextResponse.json(
        { message: "Token không hợp lệ!" },
        { status: 401 }
      );
    }

    // 1️⃣ Tạo sản phẩm (mặc định trạng thái chờ duyệt)
    const newProduct = await prisma.san_pham.create({
      data: {
        ten_san_pham,
        gia,
        mo_ta,
        so_luong_ton,
        ma_danh_muc,
        ma_nguoi_ban: userId,
        duyet_trang_thai: "ChoDuyet",
      },
    });

    // 2️⃣ Lưu file ảnh (nếu có)
    let url = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // đặt tên file an toàn
      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.jpg`;

      const uploadPath = path.join(process.cwd(), "public/uploads", filename);
      await writeFile(uploadPath, buffer);
      url = `/uploads/${filename}`;

      // 3️⃣ Lưu ảnh vào bảng san_pham_anh
      await prisma.san_pham_anh.create({
        data: {
          ma_san_pham: newProduct.ma_san_pham,
          url,
          la_anh_chinh: true,
        },
      });
    }

    return NextResponse.json({
      message: "Thêm sản phẩm thành công, chờ admin duyệt!",
      san_pham: {
        ...newProduct,
        hinh_anh: url,
      },
    });
  } catch (error) {
    console.error("Lỗi thêm sản phẩm:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
