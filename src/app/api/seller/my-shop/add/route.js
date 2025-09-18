import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

// ⚙️ Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const ten_san_pham = formData.get("ten_san_pham");
    const gia = parseFloat(formData.get("gia"));
    const mo_ta = formData.get("mo_ta");
    const ma_danh_muc = parseInt(formData.get("ma_danh_muc") || 1);
    const so_luong_ton = parseInt(formData.get("so_luong_ton") || "0");
    const tinh_trang = formData.get("tinh_trang");
    const file = formData.get("image");

    if (!ten_san_pham || isNaN(gia) || isNaN(so_luong_ton) || !tinh_trang) {
      return NextResponse.json({ message: "Thiếu dữ liệu!" }, { status: 400 });
    }

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

    // Tạo sản phẩm mới
    const newProduct = await prisma.san_pham.create({
      data: {
        ten_san_pham,
        gia,
        mo_ta,
        so_luong_ton,
        ma_danh_muc,
        ma_nguoi_ban: userId,
        tinh_trang,
        duyet_trang_thai: "ChoDuyet",
      },
    });

    let url = null;
    if (file && file.size > 0) {
      // convert file sang base64
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64File = `data:${file.type};base64,${buffer.toString(
        "base64"
      )}`;

      // upload lên cloudinary
      const uploadRes = await cloudinary.uploader.upload(base64File, {
        folder: "products",
        resource_type: "auto",
      });

      url = uploadRes.secure_url;

      // lưu link vào bảng san_pham_anh
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
