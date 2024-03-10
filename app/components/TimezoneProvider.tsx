import React, { createContext, Dispatch, useContext, useReducer } from "react";

export const TimezoneContext = createContext<timezoneState>({
  timezone: "",
  toSave: false,
});
export const TimezoneDispatchContext = createContext<
  Dispatch<timezoneDispatchTypes> | undefined
>(undefined);

const TimezoneProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [timezoneInfo, timezoneInfoDispatch] = useReducer(reducer, {
    discord: "default",
    email: "",
    isAcknowledged: false,
    isLoading: true,
    name: "",
    timezone: "",
    toSave: false,
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
  newString: timezoneState;
};

export type toggleAction = {
  type: typeof timezoneActionTypes.TOGGLE;
};

export type fetchAction = {
  type: typeof timezoneActionTypes.FETCH;
};

export interface timezoneState {
  timezone?: string;
  toSave?: boolean;
  isAcknowledged?: boolean;
  isLoading?: boolean;
  email?: string;
  name?: string;
  discord?: string;
}

export type timezoneDispatchTypes = setAction | toggleAction | fetchAction;

const reducer = (
  state: timezoneState,
  action: timezoneDispatchTypes,
): timezoneState => {
  let newState = { ...state };
  switch (action.type) {
    case timezoneActionTypes.SET: {
      newState = { ...newState, ...action.newString };
      if (state.toSave) {
        localStorage.setItem(
          "localTimezone",
          action.newString.timezone ? action.newString.timezone : "",
        );
      } else {
        localStorage.removeItem("localTimezone");
      }
      return newState;
    }
    case timezoneActionTypes.TOGGLE: {
      const checked = !state.toSave;
      const newState: timezoneState = {
        ...state,
        toSave: checked,
      };
      if (!checked) {
        localStorage.removeItem("localTimezone");
      } else {
        localStorage.setItem(
          "localTimezone",
          state.timezone ? state.timezone : "",
        );
      }
      return newState;
    }
    case timezoneActionTypes.FETCH: {
      const timezone = localStorage.getItem("localTimezone");
      if (timezone) {
        const newState: timezoneState = {
          timezone: timezone,
          toSave: true,
        };
        return newState;
      } else return { ...state };
    }

    default: {
      return { timezone: "", toSave: false };
    }
  }
};

export function useTimezone() {
  return useContext(TimezoneContext);
}

export function useTimezoneDispatch() {
  const context = useContext(TimezoneDispatchContext);
  if (context === undefined) {
    throw new Error("Timezone context must be provided by provider");
  } else return context;
}

export function useTimezoneContext() {
  return [useTimezone(), useTimezoneDispatch()] as const;
}
