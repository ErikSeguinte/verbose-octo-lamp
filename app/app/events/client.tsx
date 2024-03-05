"use client";
import { Select, TypographyStylesProvider } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";

import { sortMethod, sortMethodKeys } from "./utils";

const ClientSide = ({
  events,
}: {
  events: readonly [React.JSX.Element, React.JSX.Element];
}) => {
  const [sortState, setSort] = useState<sortMethodKeys>("Start Date");
  const sortedLists = useRef(events);
  const [nodes, setNodes] = useState<React.JSX.Element>(sortedLists.current[0]);

  useEffect(() => {
    const [daySorted, nameSorted] = sortedLists.current;
    if (sortState == "Start Date") {
      setNodes(daySorted);
    } else if (sortState == "Event Name") {
      setNodes(nameSorted);
    }
  }, [sortState, sortedLists]);
  return (
    <>
      <Select
        data={Object.keys(sortMethod)}
        label="Sort"
        value={sortState}
        onChange={(e) => {
          if (e) {
            setSort(e as sortMethodKeys);
          }
        }}
      />
      <TypographyStylesProvider>
        <ul>{nodes}</ul>
      </TypographyStylesProvider>
    </>
  );
};

export default ClientSide;
