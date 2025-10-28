import "./globals.css";

export const metadata = {
  title: "Everwish 💌",
  description: "Digital cards that celebrate life — Everwish",
  icons: {
    icon: "/favicon.ico", // asegúrate de tenerlo en /public
  },
  openGraph: {
    title: "Everwish — Digital Cards",
    description: "Send love, joy, and memories with Everwish cards.",
    url: "https://everwish2.vercel.app",
    siteName: "Everwish",
    images: [
      {
        url: "/og-image.png", // opcional, imagen para compartir
        width: 1200,
        height: 630,
        alt: "Everwish digital cards",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Everwish — Digital Cards",
    description: "Send love, joy, and memories with Everwish cards.",
    creator: "@everwishhq",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* 💖 Meta viewport para móviles */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* 💅 Fuente Everwish */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Montserrat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen bg-gradient-to-b from-[#fff5f7] via-[#fff8f9] to-white text-gray-800 antialiased">
        {/* 🌸 Contenedor principal Everwish */}
        <div className="flex flex-col min-h-screen">{children}</div>
      </body>
    </html>
  );
    }
