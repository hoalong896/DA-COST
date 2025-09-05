import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "123456";

// Middleware check seller
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

// 📌 Lấy tất cả sản phẩm của seller
export async function GET(req) {
  const auth = await authSeller(req);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const products = await prisma.san_pham.findMany({
      where: { ma_nguoi_ban: auth.user.ma_nguoi_dung },
      orderBy: { ngay_dang: "desc" },
      include: {
        san_pham_anh: {
          where: { la_anh_chinh: true },
          take: 1,
        },
      },
    });

    // Chuẩn hóa để FE dễ dùng
    const mapped = products.map((sp) => ({
      id: sp.ma_san_pham,
      ten_san_pham: sp.ten_san_pham,
      gia: sp.gia,
      mo_ta: sp.mo_ta,
      duyet_trang_thai: sp.duyet_trang_thai, // 👈 thêm trạng thái duyệt
      ngay_dang: sp.ngay_dang,
      hinh_anh: sp.san_pham_anh[0]?.url || null,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET /api/seller/my-shop error:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

// 📌 Seller xóa sản phẩm (chỉ khi chưa duyệt)
export async function DELETE(req) {
  const auth = await authSeller(req);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) {
      return NextResponse.json(
        { message: "Thiếu id sản phẩm" },
        { status: 400 }
      );
    }

    const product = await prisma.san_pham.findUnique({
      where: { ma_san_pham: id },
    });

    if (!product || product.ma_nguoi_ban !== auth.user.ma_nguoi_dung) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    if (product.duyet_trang_thai !== "ChoDuyet") {
      return NextResponse.json(
        { message: "Chỉ được xoá sản phẩm khi đang chờ duyệt" },
        { status: 400 }
      );
    }

    await prisma.san_pham.delete({ where: { ma_san_pham: id } });

    return NextResponse.json({ message: "Xoá sản phẩm thành công" });
  } catch (err) {
    console.error("DELETE /api/seller/my-shop error:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
