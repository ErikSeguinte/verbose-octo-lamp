import MaxProse from "@/components/MaxProse";
import { Input } from "@mantine/core";
import React from "react";
import { Form } from "./Form";

const Page = ({ params }: { params: { inviteId: string } }) => {
  return (
    <MaxProse>
      <div>
        <Form />
      </div>
    </MaxProse>
  );
};

export default Page;

