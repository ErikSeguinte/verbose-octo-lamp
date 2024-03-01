"use client";
import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";

import {
  mouseDispatch,
  mouseEventActions,
  useMouseEventContext,
} from "./MouseEventProvider";

const Cell = ({ dateString }: { dateString: string }) => {
  const dt = DateTime.fromISO(dateString);
  const [mouseEventState, mouseEventDispatch] = useMouseEventContext();

  const f = (dt: DateTime) => {
    if (dt.minute == 0) {
      return dt.toFormat("hha");
    } else {
      return dt.toFormat("hhmm");
    }
  };

  const toggle = (target: HTMLElement) => {
    const newState = !target.hasAttribute("data-is-selected");
    if (newState) {
      toggleOn(target);
    } else {
      toggleOff(target);
    }
  };

  const toggleOn = (target: HTMLElement) => {
    target.setAttribute("data-is-selected", "true");
    target.classList.remove("bg-slate-200");
    target.classList.add("bg-green-300");
  };

  const toggleOff = (target: HTMLElement) => {
    target.removeAttribute("data-is-selected");
    target.classList.add("bg-slate-200");
    target.classList.remove("bg-green-300");
  };

  const mousedown = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    toggle(target);
    const dispatch: mouseDispatch = {
      action: mouseEventActions.DOWN,
      isSelected: target.hasAttribute("data-is-selected"),
    };
    mouseEventDispatch(dispatch);
  };

  const mouseOver = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (mouseEventState.down) {
      if (mouseEventState.selecting) {
        toggleOn(target);
      } else toggleOff(target);
    }
  };

  let classes = classNames(
    "font-mono",
    "text-sm",
    "text-center",
    "bg-slate-200",
  );
  return (
    <td
      className={classes}
      data-dt={dateString}
      key={dt.toISO()}
      onMouseDown={mousedown}
      onMouseOver={mouseOver}
      onMouseUp={() => {
        const dispatch: mouseDispatch = { action: mouseEventActions.UP };
        mouseEventDispatch(dispatch);
      }}
    >
      {f(dt)}
    </td>
  );
};

export default Cell;
