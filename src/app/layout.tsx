
// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./Providers";
import AuthRedirect from "@/components/AuthRedirect/AuthRedirect"; // Импортируем AuthRedirect


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin panel",
  description: "Ombor hona uchun admin panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthRedirect /> {/* Добавляем AuthRedirect */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
