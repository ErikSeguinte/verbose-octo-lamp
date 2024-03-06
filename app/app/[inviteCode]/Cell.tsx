"use client";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useEffect, useRef } from "react";

import { useTimezoneContext } from "@/components/TimezoneProvider";

import {
  mouseDispatch,
  mouseEventActions,
  useMouseEventContext,
} from "./MouseEventProvider";

const Cell = ({ date }: { date: DateTime }) => {
  const dt = date;
  const dateString = date.toISO();
  const ref = useRef<HTMLTableCellElement | null>(null);
  const [mouseEventState, mouseEventDispatch] = useMouseEventContext();
  const [timezoneInfo] = useTimezoneContext();
  const f = (dt: DateTime) => {
    if (dt.minute == 0) {
      return dt.toFormat("hha");
    } else {
      return dt.toFormat("hhmm");
    }
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

  useEffect(() => {
    const element = ref.current as HTMLElement;
    const localTimezone = timezoneInfo.timezone
      ? timezoneInfo.timezone
      : "local";
    const zonedDt = date.setZone(localTimezone, { keepLocalTime: true });
    const utc = zonedDt.toUTC().toISO() as string;
    element.dataset.dt = utc;
    element.dataset.date = date.toISODate() as string;
    element.dataset.row = date.toFormat("hhmm");
  }, [date, timezoneInfo.timezone]);

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
      ref={ref}
      onPointerDown={mousedown}
      onPointerOver={mouseOver}
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
