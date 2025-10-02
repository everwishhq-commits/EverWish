import "./globals.css";
import Header from "./components/header";

export const metadata = {
  title: "Everwish",
  description: "Descubre un nuevo mundo de tarjetas digitales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-900">
        <Header />
        <main className="pt-28">{children}</main>
      </body>
    </html>
  );
}
