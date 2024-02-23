import Image from "next/image";
import Timezone from "@/components/TimezoneSelect";
import { Title } from "@mantine/core"

export default function Home() {
  return (
    <div className="flex-col gap-10"  >

      <Title className="text-6xl text-center font-bold pt-10">YAGSA </Title>
      <h2 className="text-2xl text-center text-gray-500 pb-10">Yet Another Group Scheduling App</h2>

      <Timezone />
    </div>
  );
}
