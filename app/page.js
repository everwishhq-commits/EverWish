import Splash from "./components/splash";

export default function Home() {
  return (
    <>
      <Splash />
      <main className="pt-16 md:pt-20">
        <h1 className="text-center text-3xl font-bold mt-10">
          Welcome to Everwish
        </h1>
      </main>
    </>
  );
}
