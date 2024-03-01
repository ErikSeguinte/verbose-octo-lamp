import React from "react";

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
    <div
      onPointerCancel={mouseUp}
      onPointerLeave={mouseUp}
      onPointerUp={mouseUp}
    >
      {children}
    </div>
  );
};

export default Canvas;
