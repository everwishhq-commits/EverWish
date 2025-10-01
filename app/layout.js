// app/layout.js
export const metadata = {
  title: "Everwish",
  description: "Choose your card and surprise instantly ✨",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
