import React, { createContext, Dispatch, useContext, useReducer } from "react";

export const mouseContext = createContext<mouseState>({
  down: false,
  selecting: false,
});
export const mouseDistpatchContext = createContext<
  Dispatch<mouseDispatch> | undefined
>(undefined);

const MouseEventProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [mouseEventState, mouseEventDispatch] = useReducer(mouseReducer, {
    down: false,
    selecting: false,
  });
  return (
    <>
      <mouseContext.Provider value={mouseEventState}>
        <mouseDistpatchContext.Provider value={mouseEventDispatch}>
          {children}
        </mouseDistpatchContext.Provider>
      </mouseContext.Provider>
    </>
  );
};

export default MouseEventProvider;

export interface mouseState {
  down: boolean;
  selecting: boolean;
}

export const mouseEventActions = {
  DOWN: "DOWN",
  MOUSEOVER: "MOUSEOVER",
  UP: "UP",
} as const;

export type mouseEventActionsTypes = keyof typeof mouseEventActions;

export type mouseDispatch = {
  action: mouseEventActionsTypes;
  isSelected?: boolean;
};

function mouseReducer(state: mouseState, dispatch: mouseDispatch): mouseState {
  const newState = { ...state };

  const { action, isSelected } = dispatch;
  switch (action) {
    case mouseEventActions.DOWN: {
      newState.down = true;
      newState.selecting = isSelected as boolean;
      return newState;
    }
    case mouseEventActions.UP: {
      newState.down = false;
      newState.selecting = false;
      return newState;
    }
    default: {
      return newState;
    }
  }
  return newState;
}

export function useMouseEvents() {
  return useContext(mouseContext);
}

export function useMouseEventDispatch() {
  const context = useContext(mouseDistpatchContext);
  if (context === undefined) {
    throw new Error("Context must be provided by provider");
  } else return context;
}

export function useMouseEventContext() {
  return [useMouseEvents(), useMouseEventDispatch()] as const;
}
