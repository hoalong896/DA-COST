import { NextResponse } from "next/server";

// Danh sách câu hỏi & trả lời về mua bán đồ cũ
const faq = [
  { id: 1, question: "Xin chào", answer: "Xin chào 👋! Tôi là trợ lý bán hàng đồ cũ, bạn cần hỗ trợ gì?" },
  { id: 2, question: "Mua đồ cũ", answer: "Bạn muốn mua loại đồ cũ gì? Ví dụ: điện thoại, sách, quần áo..." },
  { id: 3, question: "Bán đồ cũ", answer: "Bạn có thể đăng bán trực tiếp trên trang web, nhập thông tin sản phẩm và hình ảnh." },
  { id: 4, question: "Giá cả", answer: "Giá cả tùy thuộc vào loại và tình trạng sản phẩm. Bạn có thể so sánh với các sản phẩm tương tự." },
  { id: 5, question: "Ship hàng", answer: "Chúng tôi hỗ trợ giao hàng toàn quốc, phí ship tính theo khoảng cách." },
  { id: 6, question: "Thanh toán", answer: "Bạn có thể thanh toán bằng chuyển khoản, ví điện tử hoặc khi nhận hàng." },
  { id: 7, question: "Khuyến mãi", answer: "Hiện có giảm giá 10% cho các sản phẩm đăng bán đầu tiên trên trang." },
  { id: 8, question: "Đổi trả", answer: "Chúng tôi cho phép đổi trả trong 7 ngày nếu sản phẩm không đúng mô tả." },
  { id: 9, question: "Tình trạng sản phẩm", answer: "Các sản phẩm đều có mô tả chi tiết về tình trạng, hình ảnh minh họa kèm theo." },
  { id: 10, question: "Liên hệ hỗ trợ", answer: "Bạn có thể chat trực tiếp với chúng tôi qua bot hoặc gọi hotline 0123-456-789." },
];

export async function POST(req) {
  try {
    const { questionId } = await req.json();

    const found = faq.find(q => q.id === questionId);
    if (!found) {
      return NextResponse.json({ reply: "Câu hỏi không hợp lệ." }, { status: 400 });
    }

    return NextResponse.json({ reply: found.answer });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ reply: "Lỗi máy chủ ❌" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(faq);
}
