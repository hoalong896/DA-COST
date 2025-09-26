import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const {
      ho_ten,
      email,
      mat_khau,
      so_dien_thoai,
      dia_chi,
      vai_tro,
      ten_cua_hang,
      dia_chi_cua_hang,
    } = await req.json();

    // Kiểm tra dữ liệu bắt buộc
    if (!ho_ten || !email || !mat_khau) {
      return Response.json(
        { message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu" },
        { status: 400 }
      );
    }

    // Chuẩn hóa email
    const normalizedEmail = email.toLowerCase();

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await prisma.nguoi_dung.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return Response.json({ message: "Email đã tồn tại" }, { status: 400 });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    // Xác định vai trò
    let role = "KHACH";

    if (vai_tro === "NGUOI_BAN") {
      role = "NGUOI_BAN";
      if (!ten_cua_hang || !dia_chi_cua_hang) {
        return Response.json(
          { message: "Người bán phải có tên và địa chỉ cửa hàng" },
          { status: 400 }
        );
      }
    } else if (vai_tro === "Admin") {
      // Không cho tự đăng ký admin, ép về KHACH
      role = "KHACH";
    }

    // Tạo user mới
    const newUser = await prisma.nguoi_dung.create({
      data: {
        ho_ten,
        email: normalizedEmail,
        mat_khau: hashedPassword,
        so_dien_thoai,
        dia_chi,
        vai_tro: role,
        ten_cua_hang: role === "NGUOI_BAN" ? ten_cua_hang : null,
        dia_chi_cua_hang: role === "NGUOI_BAN" ? dia_chi_cua_hang : null,
      },
      select: {
        ma_nguoi_dung: true,
        ho_ten: true,
        email: true,
        so_dien_thoai: true,
        dia_chi: true,
        vai_tro: true,
        ten_cua_hang: true,
        dia_chi_cua_hang: true,
        ngay_tao: true,
      },
    });

    return Response.json(
      { message: "Đăng ký thành công", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi đăng ký:", error);

    if (error.code === "P2002") {
      // Prisma unique constraint
      return Response.json(
        { message: "Email đã tồn tại trong hệ thống" },
        { status: 400 }
      );
    }

    return Response.json(
      { message: "Có lỗi xảy ra khi đăng ký", error: error.message },
      { status: 500 }
    );
  }
}
