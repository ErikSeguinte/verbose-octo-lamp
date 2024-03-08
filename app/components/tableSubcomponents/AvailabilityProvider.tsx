"use client";
import React, { createContext, useContext, useState } from "react";

import { participants, timeSlots } from "@/models/Event";

const availabilityContext = createContext<[number, timeSlots]>([
  0,
  new Map<string, participants>(),
]);

export const useAvailabilityContext = () => {
  return useContext(availabilityContext);
};

const AvailabilityProvider = ({
  children,
  availability,
  maxSize,
}: {
  children: React.ReactNode;
  availability: timeSlots;
  maxSize: number;
}) => {
  const [availabilityState, _] = useState<timeSlots>(
    availability ? availability : new Map<string, participants>(),
  );

  return (
    <availabilityContext.Provider value={[maxSize, availabilityState]}>
      {children}
    </availabilityContext.Provider>
  );
};

export default AvailabilityProvider;
