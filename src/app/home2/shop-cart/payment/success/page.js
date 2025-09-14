export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-600">
        🎉 Thanh toán thành công!
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận.
      </p>

      <a
        href="/home2"
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Quay lại trang chủ
      </a>
    </div>
  );
}
