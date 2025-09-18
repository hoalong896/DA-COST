-- CreateTable
CREATE TABLE "public"."bao_cao" (
    "ma_bao_cao" SERIAL NOT NULL,
    "ma_san_pham" INTEGER NOT NULL,
    "ma_nguoi_dung" INTEGER NOT NULL,
    "ly_do" TEXT NOT NULL,
    "trang_thai" TEXT DEFAULT 'ChuaXuLy',
    "ngay_tao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bao_cao_pkey" PRIMARY KEY ("ma_bao_cao")
);

-- CreateTable
CREATE TABLE "public"."cau_hoi" (
    "ma_cau_hoi" SERIAL NOT NULL,
    "ma_san_pham" INTEGER NOT NULL,
    "ma_nguoi_mua" INTEGER NOT NULL,
    "cau_hoi" TEXT NOT NULL,
    "tra_loi" TEXT,
    "ngay_hoi" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "ngay_tra_loi" TIMESTAMP(3),

    CONSTRAINT "cau_hoi_pkey" PRIMARY KEY ("ma_cau_hoi")
);

-- CreateTable
CREATE TABLE "public"."chi_tiet_don_hang" (
    "ma_ct" SERIAL NOT NULL,
    "ma_don_hang" INTEGER NOT NULL,
    "ma_san_pham" INTEGER NOT NULL,
    "so_luong" INTEGER NOT NULL,
    "don_gia" DOUBLE PRECISION NOT NULL,
    "thanh_tien" DOUBLE PRECISION NOT NULL,
    "ma_nguoi_ban" INTEGER NOT NULL,

    CONSTRAINT "chi_tiet_don_hang_pkey" PRIMARY KEY ("ma_ct")
);

-- CreateTable
CREATE TABLE "public"."chi_tiet_gio_hang" (
    "ma_ct" SERIAL NOT NULL,
    "ma_gio_hang" INTEGER NOT NULL,
    "ma_san_pham" INTEGER NOT NULL,
    "so_luong" INTEGER NOT NULL,
    "ngay_tao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chi_tiet_gio_hang_pkey" PRIMARY KEY ("ma_ct")
);

-- CreateTable
CREATE TABLE "public"."danh_gia" (
    "ma_danh_gia" SERIAL NOT NULL,
    "ma_san_pham" INTEGER NOT NULL,
    "ma_nguoi_mua" INTEGER NOT NULL,
    "so_sao" INTEGER NOT NULL,
    "noi_dung" TEXT,
    "ngay_danh_gia" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "danh_gia_pkey" PRIMARY KEY ("ma_danh_gia")
);

-- CreateTable
CREATE TABLE "public"."danh_muc" (
    "ma_danh_muc" SERIAL NOT NULL,
    "ten_danh_muc" TEXT NOT NULL,
    "mo_ta" TEXT,
    "hien_thi" BOOLEAN DEFAULT true,
    "ngay_tao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "parent_id" INTEGER,

    CONSTRAINT "danh_muc_pkey" PRIMARY KEY ("ma_danh_muc")
);

-- CreateTable
CREATE TABLE "public"."don_hang" (
    "ma_don_hang" SERIAL NOT NULL,
    "ma_nguoi_mua" INTEGER NOT NULL,
    "tong_tien" DOUBLE PRECISION DEFAULT 0.0,
    "trang_thai" TEXT DEFAULT 'ChoXacNhan',
    "ngay_dat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "ngay_cap_nhat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "don_hang_pkey" PRIMARY KEY ("ma_don_hang")
);

-- CreateTable
CREATE TABLE "public"."gio_hang" (
    "ma_gio_hang" SERIAL NOT NULL,
    "ma_nguoi_mua" INTEGER NOT NULL,
    "ngay_tao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gio_hang_pkey" PRIMARY KEY ("ma_gio_hang")
);

-- CreateTable
CREATE TABLE "public"."nguoi_dung" (
    "ma_nguoi_dung" SERIAL NOT NULL,
    "ho_ten" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mat_khau" TEXT NOT NULL,
    "vai_tro" TEXT DEFAULT 'Khach',
    "dia_chi" TEXT,
    "so_dien_thoai" TEXT,
    "trang_thai" BOOLEAN DEFAULT true,
    "ngay_tao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "ngay_cap_nhat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "resetPasswordToken" TEXT,
    "resetPasswordExpire" TIMESTAMP(3),
    "avatar" TEXT,

    CONSTRAINT "nguoi_dung_pkey" PRIMARY KEY ("ma_nguoi_dung")
);

-- CreateTable
CREATE TABLE "public"."nhat_ky_duyet_san_pham" (
    "ma_nhat_ky" SERIAL NOT NULL,
    "ma_san_pham" INTEGER NOT NULL,
    "hanh_dong" TEXT NOT NULL,
    "ly_do" TEXT,
    "thuc_hien_boi" INTEGER NOT NULL,
    "thuc_hien_luc" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nhat_ky_duyet_san_pham_pkey" PRIMARY KEY ("ma_nhat_ky")
);

-- CreateTable
CREATE TABLE "public"."san_pham" (
    "ma_san_pham" SERIAL NOT NULL,
    "ten_san_pham" TEXT NOT NULL,
    "mo_ta" TEXT,
    "gia" DOUBLE PRECISION NOT NULL,
    "so_luong_ton" INTEGER DEFAULT 0,
    "ma_nguoi_ban" INTEGER NOT NULL,
    "ma_danh_muc" INTEGER NOT NULL,
    "duyet_trang_thai" TEXT DEFAULT 'ChoDuyet',
    "ngay_dang" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "ngay_cap_nhat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "san_pham_pkey" PRIMARY KEY ("ma_san_pham")
);

-- CreateTable
CREATE TABLE "public"."san_pham_anh" (
    "ma_anh" SERIAL NOT NULL,
    "ma_san_pham" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "la_anh_chinh" BOOLEAN DEFAULT false,
    "thu_tu" INTEGER DEFAULT 0,
    "ngay_tao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "san_pham_anh_pkey" PRIMARY KEY ("ma_anh")
);

-- CreateTable
CREATE TABLE "public"."thanh_toan" (
    "ma_thanh_toan" SERIAL NOT NULL,
    "ma_don_hang" INTEGER NOT NULL,
    "so_tien" DOUBLE PRECISION NOT NULL,
    "phuong_thuc" TEXT NOT NULL,
    "trang_thai" TEXT DEFAULT 'ChoXuLy',
    "ngay_tao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "thanh_toan_pkey" PRIMARY KEY ("ma_thanh_toan")
);

-- CreateIndex
CREATE UNIQUE INDEX "nguoi_dung_email_key" ON "public"."nguoi_dung"("email");

-- AddForeignKey
ALTER TABLE "public"."bao_cao" ADD CONSTRAINT "bao_cao_ma_nguoi_dung_fkey" FOREIGN KEY ("ma_nguoi_dung") REFERENCES "public"."nguoi_dung"("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bao_cao" ADD CONSTRAINT "bao_cao_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "public"."san_pham"("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cau_hoi" ADD CONSTRAINT "cau_hoi_ma_nguoi_mua_fkey" FOREIGN KEY ("ma_nguoi_mua") REFERENCES "public"."nguoi_dung"("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cau_hoi" ADD CONSTRAINT "cau_hoi_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "public"."san_pham"("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."chi_tiet_don_hang" ADD CONSTRAINT "chi_tiet_don_hang_ma_nguoi_ban_fkey" FOREIGN KEY ("ma_nguoi_ban") REFERENCES "public"."nguoi_dung"("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."chi_tiet_don_hang" ADD CONSTRAINT "chi_tiet_don_hang_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "public"."san_pham"("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."chi_tiet_don_hang" ADD CONSTRAINT "chi_tiet_don_hang_ma_don_hang_fkey" FOREIGN KEY ("ma_don_hang") REFERENCES "public"."don_hang"("ma_don_hang") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."chi_tiet_gio_hang" ADD CONSTRAINT "chi_tiet_gio_hang_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "public"."san_pham"("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."chi_tiet_gio_hang" ADD CONSTRAINT "chi_tiet_gio_hang_ma_gio_hang_fkey" FOREIGN KEY ("ma_gio_hang") REFERENCES "public"."gio_hang"("ma_gio_hang") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."danh_gia" ADD CONSTRAINT "danh_gia_ma_nguoi_mua_fkey" FOREIGN KEY ("ma_nguoi_mua") REFERENCES "public"."nguoi_dung"("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."danh_gia" ADD CONSTRAINT "danh_gia_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "public"."san_pham"("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."danh_muc" ADD CONSTRAINT "danh_muc_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."danh_muc"("ma_danh_muc") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."don_hang" ADD CONSTRAINT "don_hang_ma_nguoi_mua_fkey" FOREIGN KEY ("ma_nguoi_mua") REFERENCES "public"."nguoi_dung"("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."gio_hang" ADD CONSTRAINT "gio_hang_ma_nguoi_mua_fkey" FOREIGN KEY ("ma_nguoi_mua") REFERENCES "public"."nguoi_dung"("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."nhat_ky_duyet_san_pham" ADD CONSTRAINT "nhat_ky_duyet_san_pham_thuc_hien_boi_fkey" FOREIGN KEY ("thuc_hien_boi") REFERENCES "public"."nguoi_dung"("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."nhat_ky_duyet_san_pham" ADD CONSTRAINT "nhat_ky_duyet_san_pham_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "public"."san_pham"("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."san_pham" ADD CONSTRAINT "san_pham_ma_danh_muc_fkey" FOREIGN KEY ("ma_danh_muc") REFERENCES "public"."danh_muc"("ma_danh_muc") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."san_pham" ADD CONSTRAINT "san_pham_ma_nguoi_ban_fkey" FOREIGN KEY ("ma_nguoi_ban") REFERENCES "public"."nguoi_dung"("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."san_pham_anh" ADD CONSTRAINT "san_pham_anh_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "public"."san_pham"("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."thanh_toan" ADD CONSTRAINT "thanh_toan_ma_don_hang_fkey" FOREIGN KEY ("ma_don_hang") REFERENCES "public"."don_hang"("ma_don_hang") ON DELETE NO ACTION ON UPDATE NO ACTION;
