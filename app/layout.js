// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Everwish',
  description: 'Digital cards app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
