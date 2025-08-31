export default function ProductGrid() {
  return (
    <main className="flex-1 p-6">
      {/* Tiêu đề */}
      <h2 className="text-xl font-bold mb-4">Danh sách sản phẩm</h2>

      {/* Grid sản phẩm */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-4 flex flex-col">
            <div className="w-full h-32 bg-gray-300 mb-2"></div>
            <h3 className="font-semibold">Tên sản phẩm {i + 1}</h3>
            <p className="text-sm text-gray-500">Mô tả ngắn...</p>
            <p className="text-red-500 font-bold mt-2">100.000đ</p>
            <button className="mt-auto bg-purple-500 text-white px-3 py-2 rounded-lg">
              Mua ngay
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
