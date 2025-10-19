"use client";
import Splash from "../components/splash";

export default function TestPage() {
  return <Splash onFinish={() => alert("Splash terminado ✅")} />;
}
