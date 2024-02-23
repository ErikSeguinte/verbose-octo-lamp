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
          data-hs-select='{
            "hasSearch": true,
            "searchPlaceholder": "Search...",
            "searchClasses": "block w-full text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-[1] dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 py-2 px-3",
            "searchWrapperClasses": "bg-white p-2 -mx-1 sticky top-0 dark:bg-slate-900",
            "placeholder": "Select country...",
            "toggleTag": "<button type=\"button\"><span class=\"me-2\" data-icon></span><span class=\"text-gray-800 dark:text-gray-200\" data-title></span></button>",
            "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 px-4 pe-9 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-[1] dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600",
            "dropdownClasses": "mt-2 max-h-72 pb-1 px-1 space-y-0.5 z-20 w-full bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto dark:bg-slate-900 dark:border-gray-700",
            "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-gray-200 dark:focus:bg-slate-800",
            "optionTemplate": "<div><div class=\"flex items-center\"><div class=\"me-2\" data-icon></div><div class=\"text-gray-800 dark:text-gray-200\" data-title></div></div></div>"
          }'>
          {Timezones ? Timezones : null}
        </select>
      </label>

      <h1>{selectedTimezone}</h1>
    </div>
    </div>
  );
};

export default Timezone;
