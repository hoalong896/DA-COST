import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/dangnhap", req.url));
  }

  try {
    jwt.verify(token, SECRET_KEY);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/dangnhap", req.url));
  }
}

export const config = {
  matcher: ["/profile"],
};
