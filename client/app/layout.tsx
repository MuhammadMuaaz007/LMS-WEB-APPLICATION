import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";
import { Josefin_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";

export const metadata: Metadata = {
  title: "SKILLSTACK",
  description:
    "SKILLSTACK is a platform for learning and practicing programming skills",
  keywords: "React,Nextjs,Programming,Redux,Machine Learning,Nodejs,MERN",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-linear-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster position="top-center" reverseOrder={false} />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
