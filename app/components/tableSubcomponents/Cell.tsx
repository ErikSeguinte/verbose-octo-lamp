"use client";
import { Group } from "@mantine/core";
import {
  IconCrop11,
  IconDice1,
  IconDice2,
  IconDice3,
  IconDice4,
  IconDice5,
  IconDice6,
} from "@tabler/icons-react";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, {
  forwardRef,
  useCallback,
  useEffect,
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

const iconSize = 12;
const iconStroke = 1;

const dice = new Map<number | null, React.JSX.Element>();
dice.set(
  1,
  <Group className="flex-no-wrap gap-0">
    <IconDice1 size={iconSize} stroke={3} />
    <IconCrop11 className="" size={iconSize} stroke={iconStroke} />
    <IconCrop11 className="" size={iconSize} stroke={iconStroke} />
  </Group>,
);
dice.set(
  2,
  <Group className="flex-no-wrap gap-0">
    <IconDice2 size={iconSize} stroke={3} />
    <IconCrop11 className="" size={iconSize} stroke={iconStroke} />
    <IconCrop11 className="" size={iconSize} stroke={iconStroke} />
  </Group>,
);
dice.set(
  3,
  <Group className="flex-no-wrap gap-0">
    <IconDice3 size={iconSize} stroke={3} />
    <IconCrop11 className="" size={iconSize} stroke={iconStroke} />
    <IconCrop11 className="" size={iconSize} stroke={iconStroke} />
  </Group>,
);
dice.set(
  4,
  <Group className="flex-no-wrap gap-0">
    <IconDice4 size={iconSize} stroke={3} />
    <IconCrop11 className="" size={iconSize} stroke={iconStroke} />
    <IconCrop11 className="" size={iconSize} stroke={iconStroke} />
  </Group>,
);
dice.set(5, <IconDice5 size={iconSize} />);
dice.set(6, <IconDice6 size={iconSize} />);
dice.set(
  null,
  <Group className="flex-no-wrap gap-0">
    <IconCrop11 className="" size={iconSize} stroke={iconStroke} />
    <IconCrop11 className="" size={iconSize} stroke={iconStroke} />
    <IconCrop11 className="" size={iconSize} stroke={iconStroke} />
  </Group>,
);

const f = (dt: DateTime) => {
  if (dt.minute == 0) {
    return dt.toFormat("hha");
  } else {
    return dt.toFormat("hhmm");
  }
};

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

  const [timezoneInfo] = useTimezoneContext();

  let size: number | undefined = timeSlots.get(dateString as string)?.size;

  const defaultContent = (
    <CellContents
      dice={dice.get(size ? size : null) as React.JSX.Element}
      originalDt={dt}
      ref={ref}
      utcISOdt={dateString as string}
      readonly
    />
  );

  const [content, setContent] = useState(defaultContent);

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
    const p = timeSlots.get(utc as string);
    const isSelected = p ? p.size === maxSize : false;

    setContent(
      <CellContents
        dice={dice.get(p ? p.size : null) as React.JSX.Element}
        isSelected={isSelected}
        originalDt={dt}
        readonly={readonly}
        ref={ref}
        utcISOdt={utc}
      />,
    );
  }, [date, dt, maxSize, readonly, timeSlots, timezoneInfo.timezone]);

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

type contentProps = {
  dice: React.JSX.Element;
  originalDt: DateTime;
  utcISOdt: string;
  readonly?: boolean;
  isSelected?: boolean;
};

const CellContents = forwardRef<HTMLTableCellElement, contentProps>(
  function ContentComponent(props: contentProps, ref) {
    const {
      dice,
      originalDt,
      utcISOdt,
      readonly = false,
      isSelected = false,
    } = props;

    const classes = classNames(
      "font-mono",
      "text-xs",
      "text-center",
      { "bg-slate-200": !isSelected },
      { "bg-green-200": isSelected },
      "min-w-20",
      "min-h-32",
      "h-auto",
      "m-auto",
    );
    const [mouseEventState, mouseEventDispatch] = useMouseEventContext();
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

    return (
      <td
        className={classes}
        data-dt={utcISOdt}
        key={utcISOdt}
        ref={ref}
        onPointerDown={readonly ? undefined : mousedown}
        onPointerOver={readonly ? undefined : mouseOver}
        onMouseUp={
          props.readonly
            ? undefined
            : () => {
                const dispatch: mouseDispatch = {
                  action: mouseEventActions.UP,
                };
                mouseEventDispatch(dispatch);
              }
        }
      >
        <Group className="justify-center flex-no-wrap w-24">
          {f(originalDt)} {dice}
        </Group>
      </td>
    );
  },
);
