"use client"
import React from "react";
import { useState } from "react";
import DaterangePicker from "@/components/daterangePicker";

const NewEventPage = () => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  return (
<div className="flex justify-center w-screen">
    <div className="prose m-10">
      <h1>Create a new event</h1>

      <p>
        Please select the desired dates with which to ask for availabilities.
        Note that to accommodate timezone weirdness, the actual dates that will
        be offered to users may include an additional day on either end of the
        given window.
      </p>

      <section className="not-prose">
        <DaterangePicker
          dates={dates}
          setDates={setDates}
        />
      </section>
    </div>
</div>
  );
};

export default NewEventPage;
