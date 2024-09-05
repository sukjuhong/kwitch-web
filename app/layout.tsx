import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "@/app/components/socket-provider";
import AuthProvider from "@/app/components/auth-provider";

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
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />

            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
