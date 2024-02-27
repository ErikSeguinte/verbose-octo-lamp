import React from "react";

import MaxProse from "@/components/MaxProse";

import NewEventPage from "./clientSide";
import Section1 from "./section1";

const Page = () => {
  return (
    <MaxProse>
      <NewEventPage>
        <Section1 />
      </NewEventPage>
    </MaxProse>
  );
};

export default Page;
