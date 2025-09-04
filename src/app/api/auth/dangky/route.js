import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { ho_ten, email, mat_khau, so_dien_thoai, dia_chi, vai_tro } =
      await req.json();

    if (!ho_ten || !email || !mat_khau) {
      return Response.json(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.nguoi_dung.findUnique({
      where: { email },
    });
    if (existingUser) {
      return Response.json({ message: "Email đã tồn tại" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    let role = "KHACH";
    if (vai_tro === "NGUOI_BAN") {
      role = "NGUOI_BAN";
    }

    // Tạo user mới
    const newUser = await prisma.nguoi_dung.create({
      data: {
        ho_ten,
        email,
        mat_khau: hashedPassword,
        so_dien_thoai,
        dia_chi,
        vai_tro: role,
      },
      select: {
        ma_nguoi_dung: true,
        ho_ten: true,
        email: true,
        so_dien_thoai: true,
        dia_chi: true,
        vai_tro: true,
        ngay_tao: true,
      },
    });

    return Response.json(
      { message: "Đăng ký thành công", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
