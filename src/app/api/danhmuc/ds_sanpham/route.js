import { NextResponse } from "next/server";

const categories = [
  { id: 1, name: "Điện thoại" },
  { id: 2, name: "Laptop" },
  { id: 3, name: "Máy tính bảng" },
  { id: 4, name: "Phụ kiện" },
  { id: 5, name: "Đồ gia dụng" },
];

export async function GET() {
  return NextResponse.json(categories);
}
