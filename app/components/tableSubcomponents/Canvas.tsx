import { Select, Space, Stack } from "@mantine/core";
import { IconWorldSearch } from "@tabler/icons-react";
import { DateTime } from "luxon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  timezoneActionTypes,
  timezoneDispatchTypes,
  useTimezoneContext,
} from "../TimezoneProvider";
import {
  mouseDispatch,
  mouseEventActions,
  useMouseEventContext,
} from "./MouseEventProvider";

const Canvas = ({
  children,
  readonly = false,
}: {
  children: React.ReactNode;
  usingForm?: boolean;
  readonly?: boolean;
}) => {
  const [, mouseEventDispatch] = useMouseEventContext();
  const dispatch: mouseDispatch = { action: mouseEventActions.UP };
  const mouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    mouseEventDispatch(dispatch);
  };

  const mouseComponent = (
    <>
      <div
        onPointerCancel={mouseUp}
        onPointerLeave={mouseUp}
        onPointerUp={mouseUp}
      >
        {children}
      </div>
    </>
  );
  return (
    <>
      <Stack>
        <span className="max-w-prose block mx-auto">
          <TimezoneSelect />
          <LocalClock />
        </span>
        <Space h="lg" />
        {readonly ? <> {children}</> : <> {mouseComponent} </>}
      </Stack>
    </>
  );
};

export default Canvas;

export function TimezoneSelect() {
  const [timezoneInfo, timezoneDispatch] = useTimezoneContext();
  const router = useRouter();
  const pathName = usePathname();
  return (
    <>
      <Select
        className=""
        data={Intl.supportedValuesOf("timeZone")}
        label="Timezone"
        leftSection={<IconWorldSearch />}
        defaultValue={
          timezoneInfo.timezone
            ? timezoneInfo.timezone
            : DateTime.now().zoneName
        }
        clearable
        searchable
        withAsterisk
        withCheckIcon
        onChange={(e) => {
          const dispatch: timezoneDispatchTypes = {
            newString: { timezone: e ? e : "" },
            type: timezoneActionTypes.SET,
          };
          timezoneDispatch(dispatch);
          router.push(
            `${pathName}?timezone=${encodeURIComponent(e as string)}`,
          );
        }}
      />
    </>
  );
}

export function LocalClock() {
  const [dt, setDt] = useState(DateTime.local);
  const searchParams = useSearchParams();
  useEffect(() => {
    setDt(
      DateTime.local({
        zone: searchParams.get("timezone")
          ? (searchParams.get("timezone") as string)
          : "local",
      }),
    );
  }, [searchParams]);

  return (
    <>
      <span suppressHydrationWarning>
        {`${dt.toLocaleString(DateTime.TIME_SIMPLE)} ${dt.offsetNameShort}`}
      </span>
    </>
  );
}
