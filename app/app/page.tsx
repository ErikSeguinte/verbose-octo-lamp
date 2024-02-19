import Image from "next/image";
import Navbar from "./components/navbar";
import Timezone from "./components/Timezone";

export default function Home() {
  return (
    <>
    <Navbar />

    <h1 className="text-6xl text-center font-bold">YAGSA </h1>
    <h2 className="text-2xl text-center">Yet Another Group Scheduling App</h2>

    <Timezone />
    </>
  );
}
