import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const productId = formData.get("productId");
    const reason = formData.get("reason");
    const files = formData.getAll("images");

    // TODO: sau này lấy từ token
    const userId = 1;

    // Kiểm tra sản phẩm
    const product = await prisma.san_pham.findUnique({
      where: { ma_san_pham: Number(productId) },
    });
    if (!product) {
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại" },
        { status: 400 }
      );
    }

    // Xử lý upload ảnh (tối đa 2)
    let imagePaths = [];
    for (const file of files.slice(0, 2)) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(filepath, buffer);
      imagePaths.push(`/uploads/${filename}`);
    }

    // Tạo báo cáo
    const report = await prisma.bao_cao.create({
      data: {
        ma_san_pham: Number(productId),
        ma_nguoi_dung: userId,
        ly_do: reason,
        hinh_anh: imagePaths,
      },
    });

    return NextResponse.json(
      { message: "Báo cáo thành công!", report },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi gửi báo cáo:", error);
    return NextResponse.json(
      { error: "Lỗi server khi gửi báo cáo" },
      { status: 500 }
    );
  }
}
