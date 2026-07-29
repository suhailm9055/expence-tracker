import type { Metadata, Viewport } from "next";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";

export const metadata: Metadata = {
  title: "Expense Tracker | Financial Dashboard",
  description: "Track your spending, budgets, and financial insights.",
  manifest: "/manifest.json",
  icons: {
    icon: "/sample-data/expence.png",
    apple: "/sample-data/expence.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text antialiased min-h-screen">
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
