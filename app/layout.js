import "./globals.css";

export const metadata = {
  title: "Everwish",
  description: "Elige tu tarjeta y sorprende en segundos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
