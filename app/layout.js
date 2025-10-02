// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Everwish",
  description: "Discover a new world ✨",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
