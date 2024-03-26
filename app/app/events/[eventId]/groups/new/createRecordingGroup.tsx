"use client";

import { Checkbox, TypographyStylesProvider } from "@mantine/core";
import React, { useState } from "react";

import { UserDTO } from "@/models/Users";
import MaxProse from "@/components/MaxProse";

const CreateRecordingGroup = (params: { participants: UserDTO[] }) => {
  const [groupSet, setGroupSet] = useState<Set<string>>(new Set());

  return (
    <MaxProse>
      <div className="">
        <p>{JSON.stringify(Array.from(groupSet), null, 2)}</p>
        <ul className="list-none prose prose-li:-mt-4">
          {params.participants.map((u) => {
            return (
              <ListItem
                groupSet={groupSet}
                key={u._id}
                participant={u}
                setGroupSet={setGroupSet}
              />
            );
          })}
        </ul>
      </div>
    </MaxProse>
  );
};

export default CreateRecordingGroup;

const ListItem = (params: {
  participant: UserDTO;
  groupSet: Set<string>;
  setGroupSet: React.Dispatch<React.SetStateAction<Set<string>>>;
}) => {
  function handleCheck(state: boolean) {
    const clonedSet = new Set(params.groupSet);
    if (state) {
      clonedSet.add(params.participant._id);
    } else {
      clonedSet.delete(params.participant._id);
    }
    params.setGroupSet(clonedSet);
  }

  return (
    <li className="">
      <span className="inline-flex items-center">
        <Checkbox
          checked={params.groupSet.has(params.participant._id)}
          onChange={(e) => {
            const checked = !params.groupSet.has(params.participant._id);
            e.currentTarget.checked = checked;
            handleCheck(checked);
          }}
        />{" "}
        <p className="ml-2">{params.participant.name}</p>
      </span>
      {params.participant.discord ? (
        <ul className="-mt-4 ml-2">
          <li>{params.participant.discord}</li>
        </ul>
      ) : (
        <></>
      )}
    </li>
  );
};
