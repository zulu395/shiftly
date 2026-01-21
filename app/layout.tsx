import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientLayout } from "./ClientLayout";
import "./globals.css";
import { appMetadata } from "@/functions/metadata";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = appMetadata({
  title: "Shiftly",
  description: "Event and staff management made easy",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClientLayout>

      <html lang="en">
        <body className={`${inter.variable} ${inter.className} antialiased text-gray-800`}>
          <Toaster />
          {children}
        </body>
      </html>
    </ClientLayout>
  );
}
