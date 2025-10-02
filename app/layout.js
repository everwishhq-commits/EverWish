import "./globals.css";

export const metadata = {
  title: "Everwish",
  description: "Everwish digital cards",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
