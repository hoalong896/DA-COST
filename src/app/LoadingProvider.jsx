"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const LoadingCtx = createContext(null);

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const value = useMemo(
    () => ({
      loading,
      show: () => setLoading(true),
      hide: () => setLoading(false),
      // helper: chạy 1 async fn kèm overlay
      withLoading: async (fn) => {
        try {
          setLoading(true);
          return await fn();
        } finally {
          setLoading(false);
        }
      },
    }),
    [loading]
  );

  return (
    <LoadingCtx.Provider value={value}>
      {children}

      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src="/chibi.png" alt="Loading..." width={140} height={140} />
          </motion.div>
          <p className="mt-4 text-pink-700 font-semibold animate-pulse">
            Đang xử lý...
          </p>
        </div>
      )}
    </LoadingCtx.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingCtx);
  if (!ctx) throw new Error("useLoading must be used inside LoadingProvider");
  return ctx;
}
