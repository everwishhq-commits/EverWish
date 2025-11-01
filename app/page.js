"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <h1 className="text-3xl font-bold">Everwish test page 💫</h1>
      </main>
      <Footer />
    </>
  );
}
