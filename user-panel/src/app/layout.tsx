
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/app/providers";
import Footer from "@/features/app/components/Footer";


export const metadata: Metadata = {
  title: "Ummah Connect | Connecting the Islamic Community",
  description: "Ummah Connect helps the Muslim community connect with trusted people, share knowledge, and offer services — built on faith, trust, and collaboration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="en">
  <body>
    <Providers>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </Providers>
  </body>
</html>

  );
}
