import Splash from "./components/splash";

export default function Home() {
  return (
    <>
      <Splash />
      <main className="pt-16 md:pt-20">
        <h1 className="text-4xl font-bold text-center mt-10">
          Discover a new world
        </h1>
        <p className="text-center mt-4 text-lg text-gray-600">
          Welcome to Everwish, your place for digital cards.
        </p>
      </main>
    </>
  );
}
