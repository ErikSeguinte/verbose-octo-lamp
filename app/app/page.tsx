import Image from "next/image";
import Timezone from "@/components/TimezoneSelect";

export default function Home() {
  return (
    <div className="flex-col gap-10"  >

      <h1 className="text-6xl text-center font-bold pt-10 pb-8">YAGSA </h1>
      <h2 className="text-2xl text-center">Yet Another Group Scheduling App</h2>

      <Timezone />
    </div>
  );
}
