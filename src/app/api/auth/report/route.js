import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Lấy thông tin từ form
    const productId = Number(formData.get("productId"));
    const reason = formData.get("reason");
    const files = formData.getAll("images");

    // Kiểm tra productId hợp lệ
    if (!productId || isNaN(productId)) {
      return NextResponse.json({ error: "productId không hợp lệ" }, { status: 400 });
    }

    // TODO: Lấy userId từ token (tạm để 1)
    const userId = 1;

    // Kiểm tra sản phẩm tồn tại
    const product = await prisma.san_pham.findUnique({
      where: { ma_san_pham: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
    }

    // Upload ảnh (tối đa 2)
    const imagePaths = [];
    for (const file of files.slice(0, 2)) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(filepath, buffer);
      imagePaths.push(`/uploads/${filename}`);
    }

    // Tạo báo cáo
    const report = await prisma.bao_cao.create({
      data: {
        ma_san_pham: productId,
        ma_nguoi_dung: userId,
        ly_do: reason,
        hinh_anh: imagePaths,
      },
    });

    return NextResponse.json({ message: "Báo cáo thành công!", report }, { status: 201 });
  } catch (err) {
    console.error("Lỗi server khi gửi báo cáo:", err);
    return NextResponse.json({ error: "Lỗi server khi gửi báo cáo" }, { status: 500 });
  }
}
