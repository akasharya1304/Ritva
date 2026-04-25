import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AdminSidebar from "@/components/internal/admin-sidebar";

// import "@heroui/thtme/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ritva | Modern Wisdom",
  description: "Library and Yoga Management System",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased` }>
      <body className="antialiased font-body flex min-h-screen bg-background">
         <AdminSidebar />

          {/* The main content area where your pages will render */}
          <main className="flex-1 overflow-y-auto bg-cream/10">
            <div className="p-8">
              {children}
            </div>
          </main>
      </body>
    </html>
  );
}
