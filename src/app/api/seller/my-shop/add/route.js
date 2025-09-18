import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// ⚙️ Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SECRET_KEY = process.env.JWT_SECRET || "123456";

// 🛡 Middleware check seller
async function authSeller(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { error: "Unauthorized", status: 401 };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: decoded.id },
    });

    if (!user) return { error: "Người dùng không tồn tại", status: 404 };
    if (user.vai_tro !== "NGUOI_BAN")
      return { error: "Chỉ người bán mới được truy cập", status: 403 };

    return { user };
  } catch (err) {
    return { error: "Token không hợp lệ", status: 401 };
  }
}

// 📌 POST: Seller thêm sản phẩm mới
export async function POST(req) {
  const auth = await authSeller(req);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const formData = await req.formData();

    const ten_san_pham = formData.get("ten_san_pham");
    const gia = parseFloat(formData.get("gia"));
    const mo_ta = formData.get("mo_ta");
    const ma_danh_muc = parseInt(formData.get("ma_danh_muc") || "1");
    const so_luong_ton = parseInt(formData.get("so_luong_ton") || "0");
    const tinh_trang = formData.get("tinh_trang") || "Mới";
    const file = formData.get("image");

    if (!ten_san_pham || isNaN(gia) || !tinh_trang) {
      return NextResponse.json(
        { message: "Thiếu dữ liệu bắt buộc!" },
        { status: 400 }
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
        ma_nguoi_ban: auth.user.ma_nguoi_dung,
        tinh_trang,
        duyet_trang_thai: "ChoDuyet",
      },
    });

    let url = null;
    let publicId = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64File = `data:${file.type};base64,${buffer.toString(
        "base64"
      )}`;

      const uploadRes = await cloudinary.uploader.upload(base64File, {
        folder: "products",
        resource_type: "auto",
      });

      url = uploadRes.secure_url;
      publicId = uploadRes.public_id;

      await prisma.san_pham_anh.create({
        data: {
          ma_san_pham: newProduct.ma_san_pham,
          url,
          la_anh_chinh: true, // chỉ có 1 ảnh thì ảnh đó là ảnh chính
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
  } catch (err) {
    console.error("POST /api/seller/my-shop/add error:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
