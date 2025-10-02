import Splash from "./components/splash";

export default function Home() {
  return (
    <>
      <Splash />
      <main className="pt-20 text-center">
        <h1 className="text-3xl font-bold">Discover a new world</h1>
        <p className="mt-4 text-gray-600">Welcome to Everwish</p>
      </main>
    </>
  );
}
