import { Affix, Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBigDownFilled } from "@tabler/icons-react";
import classNames from "classnames";
import React from "react";

import Form from "./Form";

function InputDrawer() {
  const [opened, { open, close }] = useDisclosure(true);
  const classes = classNames({ invisible: opened });

  return (
    <>
      <Drawer
        keepMounted={true}
        opened={opened}
        title="Authentication"
        onClose={close}
      >
        <Form />
      </Drawer>
      <Affix
        position={{ bottom: "50%", left: "-5%" }}
        style={{ transform: `rotate(-90deg)` }}
      >
        <Button
          className={classes}
          leftSection={<IconArrowBigDownFilled />}
          size="compact-md"
          onClick={open}
        >
          Open Input Form
        </Button>
      </Affix>
      <Affix pb="1rem" position={{ bottom: "0%", left: "50%" }}>
        <Button className={classes} color="dark" size="lg" onClick={() => {}}>
          Submit Availability
        </Button>
      </Affix>
    </>
  );
}

export default InputDrawer;
