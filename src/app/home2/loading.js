"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-pink-200">
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/chibi.jpg"
          alt="Loading..."
          width={160}
          height={160}
          priority
        />
      </motion.div>
      <p className="mt-4 text-pink-700 font-semibold animate-pulse">
        Đang tải, vui lòng chờ...
      </p>
    </div>
  );
}
