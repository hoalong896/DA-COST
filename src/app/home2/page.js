import Header from "../components/header_main";
import DanhMuc from "../components/danhmuc";
import DanhSach from "../components/danhsach";
import Footer from "../components/Footer";

export default async function HomePage() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <DanhMuc />
      <DanhSach />
      <Footer />
    </div>
  );
}
