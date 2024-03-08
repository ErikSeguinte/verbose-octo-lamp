"use client";
import {
  IconCrop11,
  IconDice1,
  IconDice2,
  IconDice3,
  IconDice4,
  IconDice5,
  IconDice6,
  IconSquareX,
} from "@tabler/icons-react";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
dice.set(3, <IconDice3 />);
dice.set(4, <IconDice4 />);
dice.set(5, <IconDice5 />);
dice.set(6, <IconDice6 />);
dice.set(null, <IconCrop11 />);

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

  const f = (dt: DateTime) => {
    if (dt.minute == 0) {
      return dt.toFormat("hha");
    } else {
      return dt.toFormat("hhmm");
    }
  };

  const mousedown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      toggle(target);
      const dispatch: mouseDispatch = {
        action: mouseEventActions.DOWN,
        isSelected: target.hasAttribute("data-is-selected"),
      };
      mouseEventDispatch(dispatch);
    },
    [mouseEventDispatch],
  );

  const mouseOver = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (mouseEventState.down) {
        if (mouseEventState.selecting) {
          toggleOn(target);
        } else toggleOff(target);
      }
    },
    [mouseEventState.down, mouseEventState.selecting],
  );
  const classes = classNames(
    "font-mono",
    "text-sm",
    "text-center",
    { "bg-slate-200": !isSelected },
    { "bg-green-200": isSelected },
    "min-w-16",
    "min-h-32",
    "h-auto",
  );
  const serverCell = () => {
    return (
      <td
        className={classes}
        data-dt={dateString}
        key={dt.toISO()}
        ref={ref}
        onPointerDown={readonly ? undefined : mousedown}
        onPointerOver={readonly ? undefined : mouseOver}
        onMouseUp={
          readonly
            ? undefined
            : () => {
                const dispatch: mouseDispatch = {
                  action: mouseEventActions.UP,
                };
                mouseEventDispatch(dispatch);
              }
        }
      >
        {f(dt)}
      </td>
    );
  };

  const [content, setContent] = useState(serverCell());

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
    console.log(utc);
    const p = timeSlots.get(utc as string);
    setSelected(p ? p.size === maxSize : false);

    const classes = classNames(
      "font-mono",
      "text-sm",
      "text-center",
      { "bg-slate-200": !isSelected },
      { "bg-green-200": isSelected },
      "min-w-16",
      "min-h-32",
      "h-auto",
    );

    const cellContents = (die: React.JSX.Element) => {
      return (
        <td
          className={classes}
          data-dt={utc}
          key={utc}
          ref={ref}
          onPointerDown={readonly ? undefined : mousedown}
          onPointerOver={readonly ? undefined : mouseOver}
          onMouseUp={
            readonly
              ? undefined
              : () => {
                  const dispatch: mouseDispatch = {
                    action: mouseEventActions.UP,
                  };
                  mouseEventDispatch(dispatch);
                }
          }
        >
          {f(dt)} {die}
        </td>
      );
    };

    setContent(cellContents(dice.get(p ? p.size : null)));
  }, [
    date,
    dt,
    isSelected,
    maxSize,
    mouseEventDispatch,
    mouseOver,
    mousedown,
    readonly,
    timeSlots,
    timezoneInfo.timezone,
  ]);

  return <>{content}</>;
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
