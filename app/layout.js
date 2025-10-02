"use client";
import "./globals.css";
import { useState } from "react";
import Splash from "./components/splash";
import Header from "./components/header";

export default function RootLayout({ children }) {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <html lang="es">
      <body>
        {!splashDone && <Splash onFinish={() => setSplashDone(true)} />}
        {splashDone && <Header show={splashDone} />}
        <main className="pt-40">{children}</main>
      </body>
    </html>
  );
}
