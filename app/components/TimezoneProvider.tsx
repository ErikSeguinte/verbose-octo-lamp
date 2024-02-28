import { defultOptionsFilter } from "@mantine/core";
import { DateTime } from "luxon";
import React, { createContext, Dispatch, useContext, useReducer } from "react";

export const TimezoneContext = createContext<timezoneState>({
  checked: false,
  timezone: "",
});
export const TimezoneDispatchContext =
  createContext<Dispatch<TimezoneDispatchTypes>>(null);

const TimezoneProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [timezoneInfo, timezoneInfoDispatch] = useReducer(reducer, {
    checked: false,
    timezone: "",
  });
  return (
    <>
      <TimezoneContext.Provider value={timezoneInfo}>
        <TimezoneDispatchContext.Provider value={timezoneInfoDispatch}>
          {children}
        </TimezoneDispatchContext.Provider>
      </TimezoneContext.Provider>
    </>
  );
};

export default TimezoneProvider;

export const timezoneActionTypes = {
  FETCH: "FETCH",
  SET: "SET",
  TOGGLE: "TOGGLE",
} as const;

export type setAction = {
  type: typeof timezoneActionTypes.SET;
  newTimezone: string;
};

export type toggleAction = {
  type: typeof timezoneActionTypes.TOGGLE;
};

export type fetchAction = {
  type: typeof timezoneActionTypes.FETCH;
};

interface timezoneState {
  timezone: string;
  checked: boolean;
}

export type TimezoneDispatchTypes = setAction | toggleAction | fetchAction;

const reducer = (
  state: timezoneState,
  action: TimezoneDispatchTypes,
): timezoneState => {
  switch (action.type) {
    case timezoneActionTypes.SET: {
      const newState: timezoneState = {
        ...state,
        timezone: action.newTimezone,
      };
      if (state.checked) {
        localStorage.setItem("localTimezone", action.newTimezone);
      } else {
        localStorage.removeItem("localTimezone");
      }
      return newState;
    }
    case timezoneActionTypes.TOGGLE: {
      const checked = !state.checked;
      const newState: timezoneState = {
        checked: checked,
        timezone: state.timezone,
      };
      if (!checked) {
        localStorage.removeItem("localTimezone");
      } else {
        localStorage.setItem("localTimezone", state.timezone);
      }
      return newState;
    }
    case timezoneActionTypes.FETCH: {
      const timezone = localStorage.getItem("localTimezone");
      if (timezone) {
        const newState: timezoneState = {
          checked: true,
          timezone: timezone,
        };
        return newState;
      } else return { checked: false, timezone: DateTime.local().zoneName };
    }

    default: {
      return { checked: false, timezone: "" };
    }
  }
};

export function useTimezone() {
  return useContext(TimezoneContext);
}

export function useTimezoneDispatch() {
  return useContext(TimezoneDispatchContext);
}
