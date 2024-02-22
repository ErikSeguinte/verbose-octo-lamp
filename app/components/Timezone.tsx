"use client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

const Timezone = () => {
  const [Timezones, setTimezones] = useState<JSX.Element[]>([]);
  const [localTimezone, setLocalTimezone] = useState<string>("");
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");

  useEffect(() => {
    const localTime = DateTime.local();
    setLocalTimezone(localTime.zoneName);
    const timezoneNames: string[] = Intl.supportedValuesOf("timeZone");
    const tzList = timezoneNames.map((tz) => (
      <option key={"z" + tz}> {tz} </option>
    ));
    setTimezones(tzList);
    setSelectedTimezone(localTimezone);
  }, [localTimezone]);

  return (
    <div className="flex flex-col justify-center items-center">
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Please select you Timezone</span>
        </div>
        <select
          className="select select-bordered"
          suppressHydrationWarning
          value={selectedTimezone}
          onChange={(e) => {
            setSelectedTimezone(e.target.value);
          }}
        >
          {Timezones ? Timezones : null}
        </select>
      </label>

      <h1>{selectedTimezone}</h1>
    </div>
  );
};

export default Timezone;
