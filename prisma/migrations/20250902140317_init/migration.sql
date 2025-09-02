-- CreateTable
CREATE TABLE `nguoi_dung` (
    `ma_nguoi_dung` BIGINT NOT NULL AUTO_INCREMENT,
    `ho_ten` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `mat_khau` VARCHAR(191) NOT NULL,
    `vai_tro` ENUM('Khach', 'NguoiMua', 'NguoiBan', 'Admin') NOT NULL DEFAULT 'Khach',
    `dia_chi` VARCHAR(191) NULL,
    `so_dien_thoai` VARCHAR(191) NULL,
    `trang_thai` BOOLEAN NOT NULL DEFAULT true,
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngay_cap_nhat` DATETIME(3) NOT NULL,

    UNIQUE INDEX `nguoi_dung_email_key`(`email`),
    PRIMARY KEY (`ma_nguoi_dung`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danh_muc` (
    `ma_danh_muc` BIGINT NOT NULL AUTO_INCREMENT,
    `ten_danh_muc` VARCHAR(191) NOT NULL,
    `mo_ta` VARCHAR(191) NULL,
    `hien_thi` BOOLEAN NOT NULL DEFAULT true,
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ma_danh_muc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `san_pham` (
    `ma_san_pham` BIGINT NOT NULL AUTO_INCREMENT,
    `ten_san_pham` VARCHAR(191) NOT NULL,
    `mo_ta` VARCHAR(191) NULL,
    `gia` DECIMAL(65, 30) NOT NULL,
    `so_luong_ton` INTEGER NOT NULL DEFAULT 0,
    `ma_nguoi_ban` BIGINT NOT NULL,
    `ma_danh_muc` BIGINT NOT NULL,
    `duyet_trang_thai` ENUM('ChoDuyet', 'DaDuyet', 'TuChoi') NOT NULL DEFAULT 'ChoDuyet',
    `ngay_dang` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngay_cap_nhat` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ma_san_pham`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `san_pham_anh` (
    `ma_anh` BIGINT NOT NULL AUTO_INCREMENT,
    `ma_san_pham` BIGINT NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `la_anh_chinh` BOOLEAN NOT NULL DEFAULT false,
    `thu_tu` INTEGER NULL DEFAULT 0,
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ma_anh`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gio_hang` (
    `ma_gio_hang` BIGINT NOT NULL AUTO_INCREMENT,
    `ma_nguoi_mua` BIGINT NOT NULL,
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ma_gio_hang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chi_tiet_gio_hang` (
    `ma_ct` BIGINT NOT NULL AUTO_INCREMENT,
    `ma_gio_hang` BIGINT NOT NULL,
    `ma_san_pham` BIGINT NOT NULL,
    `so_luong` INTEGER NOT NULL,
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ma_ct`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chi_tiet_don_hang` (
    `ma_ct` BIGINT NOT NULL AUTO_INCREMENT,
    `ma_don_hang` BIGINT NOT NULL,
    `ma_san_pham` BIGINT NOT NULL,
    `so_luong` INTEGER NOT NULL,
    `don_gia` DECIMAL(65, 30) NOT NULL,
    `thanh_tien` DECIMAL(65, 30) NOT NULL,
    `ma_nguoi_ban` BIGINT NOT NULL,

    PRIMARY KEY (`ma_ct`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `don_hang` (
    `ma_don_hang` BIGINT NOT NULL AUTO_INCREMENT,
    `ma_nguoi_mua` BIGINT NOT NULL,
    `tong_tien` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `trang_thai` ENUM('ChoXacNhan', 'DaThanhToan', 'DangGiao', 'HoanThanh', 'Huy') NOT NULL DEFAULT 'ChoXacNhan',
    `ngay_dat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngay_cap_nhat` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ma_don_hang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thanh_toan` (
    `ma_thanh_toan` BIGINT NOT NULL AUTO_INCREMENT,
    `ma_don_hang` BIGINT NOT NULL,
    `so_tien` DECIMAL(65, 30) NOT NULL,
    `phuong_thuc` ENUM('COD', 'ChuyenKhoan', 'ViDienTu', 'The') NOT NULL,
    `trang_thai` ENUM('ChoXuLy', 'ThanhCong', 'ThatBai', 'HoanTien') NOT NULL DEFAULT 'ChoXuLy',
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ma_thanh_toan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danh_gia` (
    `ma_danh_gia` BIGINT NOT NULL AUTO_INCREMENT,
    `ma_san_pham` BIGINT NOT NULL,
    `ma_nguoi_mua` BIGINT NOT NULL,
    `so_sao` INTEGER NOT NULL,
    `noi_dung` VARCHAR(191) NULL,
    `ngay_danh_gia` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ma_danh_gia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bao_cao` (
    `ma_bao_cao` BIGINT NOT NULL AUTO_INCREMENT,
    `ma_san_pham` BIGINT NOT NULL,
    `ma_nguoi_dung` BIGINT NOT NULL,
    `ly_do` VARCHAR(191) NOT NULL,
    `trang_thai` ENUM('ChuaXuLy', 'DaXuLy') NOT NULL DEFAULT 'ChuaXuLy',
    `ngay_tao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ma_bao_cao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cau_hoi` (
    `ma_cau_hoi` BIGINT NOT NULL AUTO_INCREMENT,
    `ma_san_pham` BIGINT NOT NULL,
    `ma_nguoi_mua` BIGINT NOT NULL,
    `cau_hoi` VARCHAR(191) NOT NULL,
    `tra_loi` VARCHAR(191) NULL,
    `ngay_hoi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngay_tra_loi` DATETIME(3) NULL,

    PRIMARY KEY (`ma_cau_hoi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nhat_ky_duyet_san_pham` (
    `ma_nhat_ky` BIGINT NOT NULL AUTO_INCREMENT,
    `ma_san_pham` BIGINT NOT NULL,
    `hanh_dong` ENUM('Duyet', 'TuChoi') NOT NULL,
    `ly_do` VARCHAR(191) NULL,
    `thuc_hien_boi` BIGINT NOT NULL,
    `thuc_hien_luc` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ma_nhat_ky`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `san_pham` ADD CONSTRAINT `san_pham_ma_nguoi_ban_fkey` FOREIGN KEY (`ma_nguoi_ban`) REFERENCES `nguoi_dung`(`ma_nguoi_dung`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `san_pham` ADD CONSTRAINT `san_pham_ma_danh_muc_fkey` FOREIGN KEY (`ma_danh_muc`) REFERENCES `danh_muc`(`ma_danh_muc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `san_pham_anh` ADD CONSTRAINT `san_pham_anh_ma_san_pham_fkey` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham`(`ma_san_pham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gio_hang` ADD CONSTRAINT `gio_hang_ma_nguoi_mua_fkey` FOREIGN KEY (`ma_nguoi_mua`) REFERENCES `nguoi_dung`(`ma_nguoi_dung`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_gio_hang` ADD CONSTRAINT `chi_tiet_gio_hang_ma_gio_hang_fkey` FOREIGN KEY (`ma_gio_hang`) REFERENCES `gio_hang`(`ma_gio_hang`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_gio_hang` ADD CONSTRAINT `chi_tiet_gio_hang_ma_san_pham_fkey` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham`(`ma_san_pham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_don_hang` ADD CONSTRAINT `chi_tiet_don_hang_ma_don_hang_fkey` FOREIGN KEY (`ma_don_hang`) REFERENCES `don_hang`(`ma_don_hang`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_don_hang` ADD CONSTRAINT `chi_tiet_don_hang_ma_san_pham_fkey` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham`(`ma_san_pham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chi_tiet_don_hang` ADD CONSTRAINT `chi_tiet_don_hang_ma_nguoi_ban_fkey` FOREIGN KEY (`ma_nguoi_ban`) REFERENCES `nguoi_dung`(`ma_nguoi_dung`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `don_hang` ADD CONSTRAINT `don_hang_ma_nguoi_mua_fkey` FOREIGN KEY (`ma_nguoi_mua`) REFERENCES `nguoi_dung`(`ma_nguoi_dung`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanh_toan` ADD CONSTRAINT `thanh_toan_ma_don_hang_fkey` FOREIGN KEY (`ma_don_hang`) REFERENCES `don_hang`(`ma_don_hang`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `danh_gia` ADD CONSTRAINT `danh_gia_ma_san_pham_fkey` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham`(`ma_san_pham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `danh_gia` ADD CONSTRAINT `danh_gia_ma_nguoi_mua_fkey` FOREIGN KEY (`ma_nguoi_mua`) REFERENCES `nguoi_dung`(`ma_nguoi_dung`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bao_cao` ADD CONSTRAINT `bao_cao_ma_san_pham_fkey` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham`(`ma_san_pham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bao_cao` ADD CONSTRAINT `bao_cao_ma_nguoi_dung_fkey` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung`(`ma_nguoi_dung`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cau_hoi` ADD CONSTRAINT `cau_hoi_ma_san_pham_fkey` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham`(`ma_san_pham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cau_hoi` ADD CONSTRAINT `cau_hoi_ma_nguoi_mua_fkey` FOREIGN KEY (`ma_nguoi_mua`) REFERENCES `nguoi_dung`(`ma_nguoi_dung`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nhat_ky_duyet_san_pham` ADD CONSTRAINT `nhat_ky_duyet_san_pham_ma_san_pham_fkey` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham`(`ma_san_pham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nhat_ky_duyet_san_pham` ADD CONSTRAINT `nhat_ky_duyet_san_pham_thuc_hien_boi_fkey` FOREIGN KEY (`thuc_hien_boi`) REFERENCES `nguoi_dung`(`ma_nguoi_dung`) ON DELETE RESTRICT ON UPDATE CASCADE;
