import Header from "./components/header";
import Splash from "./components/splash";

export default function Page() {
  return (
    <>
      <Splash />
      <Header />
      {/* padding para no tapar el contenido (coincide con h-28 / h-16) */}
      <main className="pt-32 md:pt-36">
        <section className="max-w-3xl mx-auto px-4 text-center mt-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Discover a new world
          </h1>
          <p className="mt-4 text-gray-600">Bienvenido a Everwish ✨</p>
          {/* aquí irán carrusel, categorías, etc. */}
        </section>
      </main>
    </>
  );
}
