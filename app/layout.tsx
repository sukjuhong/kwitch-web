import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ChannelNav from "@/components/channel-nav";

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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />

          <div className="border-b grid grid-cols-5">
            <div className="border-r">
              <ChannelNav />
            </div>
            <div className="col-span-4">{children}</div>
          </div>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
