import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingProvider from "./components/LoadingProvider";
import RouteLoadingHandler from "./components/RouteLoadingHandler";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "./components/ThemeToggle"; // client component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OLD BUT GOLD",
  description: "Website mua bán đồ cũ chất lượng",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class" // thêm class="dark" vào <html> khi dark mode
          defaultTheme="light" // theme mặc định
          enableSystem={true} // cho phép theo system (Windows/Mac)
        >
          <LoadingProvider>
            <RouteLoadingHandler />
            <ThemeToggle /> {/* nút đổi theme */}
            {children}
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
