-- CreateTable
CREATE TABLE "bao_cao" (
    "ma_bao_cao" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ma_san_pham" INTEGER NOT NULL,
    "ma_nguoi_dung" INTEGER NOT NULL,
    "ly_do" TEXT NOT NULL,
    "trang_thai" TEXT DEFAULT 'ChuaXuLy',
    "ngay_tao" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bao_cao_ma_nguoi_dung_fkey" FOREIGN KEY ("ma_nguoi_dung") REFERENCES "nguoi_dung" ("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "bao_cao_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "san_pham" ("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "cau_hoi" (
    "ma_cau_hoi" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ma_san_pham" INTEGER NOT NULL,
    "ma_nguoi_mua" INTEGER NOT NULL,
    "cau_hoi" TEXT NOT NULL,
    "tra_loi" TEXT,
    "ngay_hoi" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "ngay_tra_loi" DATETIME,
    CONSTRAINT "cau_hoi_ma_nguoi_mua_fkey" FOREIGN KEY ("ma_nguoi_mua") REFERENCES "nguoi_dung" ("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "cau_hoi_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "san_pham" ("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "chi_tiet_don_hang" (
    "ma_ct" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ma_don_hang" INTEGER NOT NULL,
    "ma_san_pham" INTEGER NOT NULL,
    "so_luong" INTEGER NOT NULL,
    "don_gia" REAL NOT NULL,
    "thanh_tien" REAL NOT NULL,
    "ma_nguoi_ban" INTEGER NOT NULL,
    CONSTRAINT "chi_tiet_don_hang_ma_nguoi_ban_fkey" FOREIGN KEY ("ma_nguoi_ban") REFERENCES "nguoi_dung" ("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "chi_tiet_don_hang_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "san_pham" ("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "chi_tiet_don_hang_ma_don_hang_fkey" FOREIGN KEY ("ma_don_hang") REFERENCES "don_hang" ("ma_don_hang") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "chi_tiet_gio_hang" (
    "ma_ct" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ma_gio_hang" INTEGER NOT NULL,
    "ma_san_pham" INTEGER NOT NULL,
    "so_luong" INTEGER NOT NULL,
    "ngay_tao" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chi_tiet_gio_hang_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "san_pham" ("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "chi_tiet_gio_hang_ma_gio_hang_fkey" FOREIGN KEY ("ma_gio_hang") REFERENCES "gio_hang" ("ma_gio_hang") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "danh_gia" (
    "ma_danh_gia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ma_san_pham" INTEGER NOT NULL,
    "ma_nguoi_mua" INTEGER NOT NULL,
    "so_sao" INTEGER NOT NULL,
    "noi_dung" TEXT,
    "ngay_danh_gia" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "danh_gia_ma_nguoi_mua_fkey" FOREIGN KEY ("ma_nguoi_mua") REFERENCES "nguoi_dung" ("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "danh_gia_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "san_pham" ("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "danh_muc" (
    "ma_danh_muc" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ten_danh_muc" TEXT NOT NULL,
    "mo_ta" TEXT,
    "hien_thi" BOOLEAN DEFAULT true,
    "ngay_tao" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "don_hang" (
    "ma_don_hang" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ma_nguoi_mua" INTEGER NOT NULL,
    "tong_tien" REAL DEFAULT 0.0,
    "trang_thai" TEXT DEFAULT 'ChoXacNhan',
    "ngay_dat" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "ngay_cap_nhat" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "don_hang_ma_nguoi_mua_fkey" FOREIGN KEY ("ma_nguoi_mua") REFERENCES "nguoi_dung" ("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "gio_hang" (
    "ma_gio_hang" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ma_nguoi_mua" INTEGER NOT NULL,
    "ngay_tao" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "gio_hang_ma_nguoi_mua_fkey" FOREIGN KEY ("ma_nguoi_mua") REFERENCES "nguoi_dung" ("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "nguoi_dung" (
    "ma_nguoi_dung" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ho_ten" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mat_khau" TEXT NOT NULL,
    "vai_tro" TEXT DEFAULT 'Khach',
    "dia_chi" TEXT,
    "so_dien_thoai" TEXT,
    "trang_thai" BOOLEAN DEFAULT true,
    "ngay_tao" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "ngay_cap_nhat" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "resetPasswordToken" TEXT,
    "resetPasswordExpire" DATETIME,
    "avatar" TEXT
);

-- CreateTable
CREATE TABLE "nhat_ky_duyet_san_pham" (
    "ma_nhat_ky" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ma_san_pham" INTEGER NOT NULL,
    "hanh_dong" TEXT NOT NULL,
    "ly_do" TEXT,
    "thuc_hien_boi" INTEGER NOT NULL,
    "thuc_hien_luc" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "nhat_ky_duyet_san_pham_thuc_hien_boi_fkey" FOREIGN KEY ("thuc_hien_boi") REFERENCES "nguoi_dung" ("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "nhat_ky_duyet_san_pham_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "san_pham" ("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "san_pham" (
    "ma_san_pham" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ten_san_pham" TEXT NOT NULL,
    "mo_ta" TEXT,
    "gia" REAL NOT NULL,
    "so_luong_ton" INTEGER DEFAULT 0,
    "ma_nguoi_ban" INTEGER NOT NULL,
    "ma_danh_muc" INTEGER NOT NULL,
    "duyet_trang_thai" TEXT DEFAULT 'ChoDuyet',
    "ngay_dang" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "ngay_cap_nhat" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "san_pham_ma_danh_muc_fkey" FOREIGN KEY ("ma_danh_muc") REFERENCES "danh_muc" ("ma_danh_muc") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "san_pham_ma_nguoi_ban_fkey" FOREIGN KEY ("ma_nguoi_ban") REFERENCES "nguoi_dung" ("ma_nguoi_dung") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "san_pham_anh" (
    "ma_anh" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ma_san_pham" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "la_anh_chinh" BOOLEAN DEFAULT false,
    "thu_tu" INTEGER DEFAULT 0,
    "ngay_tao" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "san_pham_anh_ma_san_pham_fkey" FOREIGN KEY ("ma_san_pham") REFERENCES "san_pham" ("ma_san_pham") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "thanh_toan" (
    "ma_thanh_toan" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ma_don_hang" INTEGER NOT NULL,
    "so_tien" REAL NOT NULL,
    "phuong_thuc" TEXT NOT NULL,
    "trang_thai" TEXT DEFAULT 'ChoXuLy',
    "ngay_tao" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "thanh_toan_ma_don_hang_fkey" FOREIGN KEY ("ma_don_hang") REFERENCES "don_hang" ("ma_don_hang") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "nguoi_dung_email_key" ON "nguoi_dung"("email");
