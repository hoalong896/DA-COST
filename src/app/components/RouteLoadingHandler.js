"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoading } from "./LoadingProvider";

export default function RouteLoadingHandler() {
  const pathname = usePathname();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [pathname, setIsLoading]);

  return null;
}
