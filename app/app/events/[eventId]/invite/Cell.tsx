"use client";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

import { useTimezone } from "@/components/TimezoneProvider";

const Cell = ({ dateString }: { dateString: string }) => {
  const dt = DateTime.fromISO(dateString);

  const f = (dt: DateTime) => {
    if (dt.minute == 0) {
      return dt.toFormat("hha");
    } else {
      return dt.toFormat("hhmm");
    }
  };

  return (
    <td
      className="font-mono text-sm text-center bg-slate-200 border-1"
      key={dt.toISO()}
    >
      {f(dt)}
    </td>
  );
};

export default Cell;
