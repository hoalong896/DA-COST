import Header from "../components/Header";
import DanhMuc from "../components/danhmuc";
import DanhSach from "../components/danhsach";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <DanhMuc />
      <DanhSach />
      <Footer />
    </div>
  );
}
