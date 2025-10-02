import "./globals.css";

export const metadata = {
  title: "Everwish",
  description: "Everwish Cards App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
