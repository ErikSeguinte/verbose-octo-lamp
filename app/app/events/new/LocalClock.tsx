"use client";
import { LoadingOverlay } from "@mantine/core";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

const LocalClock = () => {
  const [tz, setTz] = useState("");
  const [dt, setDt] = useState<DateTime>(DateTime.local);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTz(localStorage.getItem("localTimezone") as string);
    setDt(DateTime.local({ zone: tz }));
    setIsLoading(false);
  }, [tz]);

  useEffect(() => {
    setDt(DateTime.local());
  }, [dt, tz]);
  if (!tz) {
    return <></>;
  }

  return (
    <div className="text-center">
      <LoadingOverlay
        overlayProps={{ blur: 2, radius: "sm" }}
        visible={isLoading}
        zIndex={1000}
      />
      Your local time & timezone:
      <br />
      {`${dt.toLocaleString(DateTime.TIME_SIMPLE)} ${dt.offsetNameShort}`}
      <br />
      {`${tz}`}
    </div>
  );
};

export default LocalClock;
