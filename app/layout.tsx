import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SessionProvider from "@/components/session-provider";
import { Toaster } from "@/components/ui/toaster";
import SocketProvider from "@/components/socket-provider";

export const metadata: Metadata = {
  title: "Kwitch",
  description: "Software architecture term project - Kwitch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen overflow-hidden">
        <SessionProvider>
          <SocketProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              {children}
              <Footer />
              <Toaster />
            </ThemeProvider>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
