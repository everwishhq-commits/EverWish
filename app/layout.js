import "./globals.css";
import { metadata } from "./metadata";

export { metadata };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
