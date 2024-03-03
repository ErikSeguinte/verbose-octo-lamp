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
      <Affix position={{ bottom: "50%", left: -48 }}>
        <Button
          className={classes}
          leftSection={<IconArrowBigDownFilled />}
          style={{ transform: `rotate(-90deg)` }}
          onClick={open}
        >
          {/* {IconArrowBigDownFilled}  */} Open Input Form
        </Button>
      </Affix>
    </>
  );
}

export default InputDrawer;
