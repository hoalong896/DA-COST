import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// ⚙️ Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";

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

    // chuyển file -> buffer -> base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // upload lên Cloudinary
    const uploadRes = await cloudinary.uploader.upload(base64File, {
      folder: "uploads", // thư mục trong Cloudinary
      resource_type: "auto",
    });

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ message: "Lỗi upload" }, { status: 500 });
  }
}
