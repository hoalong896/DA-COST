-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_danh_muc" (
    "ma_danh_muc" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ten_danh_muc" TEXT NOT NULL,
    "mo_ta" TEXT,
    "hien_thi" BOOLEAN DEFAULT true,
    "ngay_tao" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "parent_id" INTEGER,
    CONSTRAINT "danh_muc_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "danh_muc" ("ma_danh_muc") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_danh_muc" ("hien_thi", "ma_danh_muc", "mo_ta", "ngay_tao", "ten_danh_muc") SELECT "hien_thi", "ma_danh_muc", "mo_ta", "ngay_tao", "ten_danh_muc" FROM "danh_muc";
DROP TABLE "danh_muc";
ALTER TABLE "new_danh_muc" RENAME TO "danh_muc";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
