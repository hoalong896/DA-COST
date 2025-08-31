export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <h4 className="font-semibold mb-2">Giới thiệu</h4>
        <p>OBG - nơi tốt nhất để mua sắm online.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Liên hệ</h4>
        <ul>
          <li>Facebook</li>
          <li>Gmail</li>
          <li>Phone</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Chính sách</h4>
        <ul>
          <li>Bảo mật</li>
          <li>Thanh toán</li>
          <li>Vận chuyển</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Hỗ trợ</h4>
        <ul>
          <li>FAQ</li>
          <li>Liên hệ</li>
        </ul>
      </div>
    </footer>
  );
}
