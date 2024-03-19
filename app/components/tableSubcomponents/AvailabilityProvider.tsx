"use client";
import React, { createContext, useContext, useState } from "react";

const availabilityContext = createContext<
  [number, Record<string, Set<string>>]
>([0, {}]);

export const useAvailabilityContext = () => {
  return useContext(availabilityContext);
};

const AvailabilityProvider = ({
  children,
  availability,
  maxSize,
}: {
  children: React.ReactNode;
  availability: Record<string, Set<string>>;
  maxSize: number;
}) => {
  const [availabilityState, _] = useState<Record<string, Set<string>>>(
    availability ? availability : {},
  );

  return (
    <availabilityContext.Provider value={[maxSize, availabilityState]}>
      {children}
    </availabilityContext.Provider>
  );
};

export default AvailabilityProvider;
