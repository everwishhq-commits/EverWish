"use client";

import "./globals.css";

export const metadata = {
  title: "Everwish",
  description: "Everwish digital cards",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
