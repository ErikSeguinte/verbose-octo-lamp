import { Affix, Button } from "@mantine/core";
import React from "react";

import InputDrawer from "../../app/invite/[inviteCode]/(form)/Drawer";
import {
  mouseDispatch,
  mouseEventActions,
  useMouseEventContext,
} from "./MouseEventProvider";

const Canvas = ({
  children,
  readonly = false,
  eventId,
}: {
  children: React.ReactNode;
  usingForm?: boolean;
  readonly?: boolean;
  eventId?: string;
}) => {
  const [, mouseEventDispatch] = useMouseEventContext();
  const dispatch: mouseDispatch = { action: mouseEventActions.UP };
  const mouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    mouseEventDispatch(dispatch);
  };

  const mouseComponent = (
    <>
      <div
        onPointerCancel={mouseUp}
        onPointerLeave={mouseUp}
        onPointerUp={mouseUp}
      >
        {children}
      </div>
    </>
  );
  return (
    <>
      {/* {usingForm ? <InputDrawer eventId={eventId as string} /> : null} */}
      {readonly ? <> {children}</> : <> {mouseComponent} </>}
    </>
  );
};

export default Canvas;
