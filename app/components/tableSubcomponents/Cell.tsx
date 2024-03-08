"use client";
import {
  IconDice1,
  IconDice2,
  IconDice3,
  IconDice4,
  IconDice5,
  IconDice6,
} from "@tabler/icons-react";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { useTimezoneContext } from "@/components/TimezoneProvider";

import { useAvailabilityContext } from "./AvailabilityProvider";
import {
  mouseDispatch,
  mouseEventActions,
  useMouseEventContext,
} from "./MouseEventProvider";

const dice = new Map();
dice.set(1, <IconDice1 />);
dice.set(2, <IconDice2 />);
dice.set(4, <IconDice3 />);
dice.set(4, <IconDice4 />);
dice.set(5, <IconDice5 />);
dice.set(6, <IconDice6 />);
dice.set(null, null);

const Cell = ({
  date,
  slots,
  readonly,
}: {
  date: DateTime;
  slots?: Set<string>;
  readonly?: boolean;
}) => {
  const dt = date;
  const [maxSize, timeSlots] = useAvailabilityContext();
  const dateString = date.toISO();
  const ref = useRef<HTMLTableCellElement | null>(null);
  const [mouseEventState, mouseEventDispatch] = useMouseEventContext();
  const [timezoneInfo] = useTimezoneContext();

  const [participantsState, setParticipantState] = useState(
    timeSlots.get(dateString as string),
  );

  const [isSelected, setSelected] = useState(
    participantsState ? participantsState.size === maxSize : false,
  );

  const [diceState, setDiceState] = useState(
    dice.get(participantsState ? participantsState.size : null),
  );
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
  const classes = classNames(
    "font-mono",
    "text-sm",
    "text-center",
    "bg-slate-200",
  );
  const unselectedCell = (
    <td
      className={classes}
      data-dt={dateString}
      key={dt.toISO()}
      ref={ref}
      suppressHydrationWarning
      onPointerDown={readonly ? undefined : mousedown}
      onPointerOver={readonly ? undefined : mouseOver}
      onMouseUp={
        readonly
          ? undefined
          : () => {
              const dispatch: mouseDispatch = { action: mouseEventActions.UP };
              mouseEventDispatch(dispatch);
            }
      }
    >
      {f(dt)} {participantsState ? participantsState.size : 0}
    </td>
  );
  const selectedClasses = classNames(
    "font-mono",
    "text-sm",
    "text-center",
    "bg-green-300",
  );

  const selectedCell = (
    <td
      className={selectedClasses}
      data-dt={dateString}
      key={dt.toISO()}
      ref={ref}
      data-is-selected
      suppressHydrationWarning
      onPointerDown={readonly ? undefined : mousedown}
      onPointerOver={readonly ? undefined : mouseOver}
      onMouseUp={
        readonly
          ? undefined
          : () => {
              const dispatch: mouseDispatch = { action: mouseEventActions.UP };
              mouseEventDispatch(dispatch);
            }
      }
    >
      {f(dt)} {participantsState ? participantsState.size : 0}
    </td>
  );

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

    setParticipantState(timeSlots.get(utc));
    setSelected(participantsState ? participantsState.size === maxSize : false);
    setDiceState(dice.get(participantsState ? participantsState.size : null));
  }, [
    date,
    timezoneInfo.timezone,
    isSelected,
    slots,
    participantsState,
    timeSlots,
    maxSize,
  ]);

  return <>{isSelected ? selectedCell : unselectedCell}</>;
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
