import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs"; // bắt buộc để dùng fs/path

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "Không có file nào được gửi" },
        { status: 400 }
      );
    }

    // tạo thư mục lưu ảnh nếu chưa có
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // đặt tên file duy nhất
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    // ghi file vào thư mục public/uploads
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // đường dẫn public để hiển thị lại trên UI
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ url: fileUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ message: "Lỗi upload" }, { status: 500 });
  }
}
