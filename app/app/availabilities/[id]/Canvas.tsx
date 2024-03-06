import React from "react";

import InputDrawer from "./(form)/Drawer";
import {
  mouseDispatch,
  mouseEventActions,
  useMouseEventContext,
} from "./MouseEventProvider";

const Canvas = ({ children }: { children: React.ReactNode }) => {
  const [, mouseEventDispatch] = useMouseEventContext();
  const dispatch: mouseDispatch = { action: mouseEventActions.UP };
  const mouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    mouseEventDispatch(dispatch);
  };
  return (
    <>
      <InputDrawer />
      <div
        onPointerCancel={mouseUp}
        onPointerLeave={mouseUp}
        onPointerUp={mouseUp}
      >
        {children}
      </div>{" "}
    </>
  );
};

export default Canvas;
