import React from "react";

import {
  mouseDispatch,
  mouseEventActions,
  useMouseEventContext,
} from "./MouseEventProvider";

const Canvas = ({
  children,
  readonly = false,
}: {
  children: React.ReactNode;
  usingForm?: boolean;
  readonly?: boolean;
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
  return <>{readonly ? <> {children}</> : <> {mouseComponent} </>}</>;
};

export default Canvas;
