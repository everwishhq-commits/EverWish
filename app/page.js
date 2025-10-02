import Splash from "./components/splash";

export default function Home() {
  return (
    <>
      <Splash />
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">Welcome to Everwish</h1>
        <p className="mt-4 text-gray-600">Discover a new world of creations</p>
      </main>
    </>
  );
}
