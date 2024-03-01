"use client";
import { IconTarget } from "@tabler/icons-react";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useEffect, useReducer, useState } from "react";

import { useTimezone } from "@/components/TimezoneProvider";

interface mouseState {
  down: boolean;
  selecting: boolean;
}

const mouseEventActions = {
  DOWN: "DOWN",
  MOUSEOVER: "MOUSEOVER",
  UP: "UP",
} as const;

type mouseEventActions = keyof typeof mouseEventActions;

type mouseDispatch = {
  action: mouseEventActions;
  isSelected?: boolean;
};

function mouseReducer(state: mouseState, dispatch: mouseDispatch): mouseState {
  const newState = { ...state };
  console.log("dispatched!");

  const { action, isSelected } = dispatch;
  switch (action) {
    case mouseEventActions.DOWN: {
      newState.down = true;
      newState.selecting = isSelected as boolean;
      console.log("DOWN");
      console.log(newState);
      return newState;
    }
    case mouseEventActions.UP: {
      newState.down = false;
      newState.selecting = false;
      console.log("UP");
      return newState;
    }
    default: {
      return newState;
    }
  }
  return newState;
}

const Cell = ({ dateString }: { dateString: string }) => {
  const dt = DateTime.fromISO(dateString);
  const [slotState, setSlotState] = useState(false);
  const [mouseEventState, mouseEventDispatch] = useReducer(mouseReducer, {
    down: false,
    selecting: false,
  });

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
    console.log("MOUSEOVER");
    console.log(mouseEventState);
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
    { "bg-slate-200": !slotState },
    { "bg-green-300": slotState },
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
