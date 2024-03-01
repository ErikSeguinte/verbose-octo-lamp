import React from "react";

export default function MaxProse({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-auto justify-center">
      <div className="flex-col justify-center max-w-prose">{children}</div>
    </div>
  );
}
