import { Theme, ThemeContextProvider } from "@/context/ThemeContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WriteAhead",
  description: "Write peacefully. Your data never leaves our computer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = getTheme();

  return (
    <html lang="en">
      <body className={`${inter.className} ${theme}`}>
        <ThemeContextProvider initialTheme={theme}>
          {children}
        </ThemeContextProvider>
      </body>
    </html>
  );
}

function getTheme() {
  const theme = cookies().get("theme")?.value as Theme | undefined;
  return theme || "light";
}
