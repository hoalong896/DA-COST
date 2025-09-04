import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // app password chứ không phải mật khẩu Gmail thường
    },
  });

  await transporter.sendMail({
    from: `"OBG Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
