import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email } = await req.json();
    const user = await prisma.nguoi_dung.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "Email không tồn tại!" },
        { status: 400 }
      );
    }

    // Tạo token reset
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    // Lưu token vào DB
    await prisma.nguoi_dung.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpire,
      },
    });

    const resetUrl = `http://localhost:3000/reset_pass?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail của bạn
        pass: process.env.EMAIL_PASS, // App password của Gmail
      },
    });

    // Gửi mail
    await transporter.sendMail({
      from: `"OBG Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `
        <h3>Bạn đã yêu cầu đặt lại mật khẩu</h3>
        <p>Nhấn vào link bên dưới để đặt lại mật khẩu (có hiệu lực trong 15 phút):</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      `,
    });

    return NextResponse.json({
      message: " Link đặt lại mật khẩu đã được gửi đến email của bạn!",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: " Lỗi server!" }, { status: 500 });
  }
}
