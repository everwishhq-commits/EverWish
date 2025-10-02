import "./components/globals.css";
import Header from "./components/header";

export const metadata = {
  title: "Everwish",
  description: "Discover a new world",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main className="pt-28 md:pt-32">{children}</main>
      </body>
    </html>
  );
}
