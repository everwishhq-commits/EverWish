import "./globals.css";

// ⚙️ Fuerza renderizado solo en cliente
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const metadata = {
  title: "Everwish – Share Moments That Last Forever 💌",
  description:
    "Envía tarjetas digitales hermosas para cada ocasión. Celebra el amor, la amistad, la familia y la vida con Everwish.",
  openGraph: {
    title: "Everwish – Tarjetas Digitales Hermosas 💫",
    description:
      "Crea, personaliza y comparte momentos únicos con tarjetas digitales animadas de Everwish.",
    url: "https://everwish.store",
    siteName: "Everwish",
    images: [
      {
        url: "/og-image.jpg", // Puedes agregar una imagen principal de portada
        width: 1200,
        height: 630,
        alt: "Everwish digital cards",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  themeColor: "#FFDDE7",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* 🌸 Fuentes de marca */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* 🎨 Meta visual */}
        <meta name="theme-color" content="#FFDDE7" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      {/* 🌷 Cuerpo Everwish */}
      <body className="antialiased text-gray-800 overflow-x-hidden m-0 p-0 font-poppins bg-white">
        {children}
      </body>
    </html>
  );
        }
