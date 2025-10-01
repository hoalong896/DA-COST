import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingProvider from "./components/LoadingProvider";
import RouteLoadingHandler from "./components/RouteLoadingHandler";
import ClientWrapper from "./components/ClientWrapper";
import Chatbot from "./components/chatbot";


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
        <ClientWrapper>
          <LoadingProvider>
            <RouteLoadingHandler />
            {children}
            <Chatbot/>
          </LoadingProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
