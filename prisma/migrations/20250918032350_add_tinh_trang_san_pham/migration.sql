-- CreateEnum
CREATE TYPE "public"."TinhTrang" AS ENUM ('MOI', 'TRUNG', 'CU');

-- AlterTable
ALTER TABLE "public"."san_pham" ADD COLUMN     "tinh_trang" "public"."TinhTrang" NOT NULL DEFAULT 'MOI';
