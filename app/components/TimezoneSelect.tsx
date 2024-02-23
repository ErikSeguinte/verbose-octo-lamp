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
      <div>
      <label className="">
          Please select your Timezone
        <select
          className="py-3 px-4 pe-9 block w-full bg-gray-100 border-2 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-transparent dark:text-gray-400 dark:focus:ring-gray-600"
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
    </div>
  );
};

export default Timezone;
