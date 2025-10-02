import Splash from "./components/splash";

export default function Home() {
  return (
    <>
      <Splash />

      <main className="p-6 text-center">
        <h1 className="text-3xl font-bold">Bienvenido a Everwish 🎉</h1>
        <p className="mt-4 text-lg">Aquí irá el contenido de la página</p>
      </main>
    </>
  );
}
