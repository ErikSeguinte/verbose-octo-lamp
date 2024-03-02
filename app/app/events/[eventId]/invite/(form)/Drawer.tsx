import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

import Form from "./Form";

function InputDrawer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} title="Authentication" onClose={close}>
        <Form />
      </Drawer>

      <Button onClick={open}>Open Drawer</Button>
    </>
  );
}

export default InputDrawer;
