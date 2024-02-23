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
      <label className="top-0 start-0 p-4 h-full truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
    peer-focus:text-xs
    peer-focus:-translate-y-1.5
    peer-focus:text-gray-500
    peer-[:not(:placeholder-shown)]:text-xs
    peer-[:not(:placeholder-shown)]:-translate-y-1.5
    peer-[:not(:placeholder-shown)]:text-gray-500">
        <div className="label">
          <span className="label-text">Please select you Timezone</span>
        </div>
        <select
          className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
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
