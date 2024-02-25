"use client";
import { Button, CopyButton } from "@mantine/core";
import { IconCheck, IconClipboard } from "@tabler/icons-react";
import React from "react";

const CopyButton_ = ({ value }: { value: string }) => {
  return (
    <CopyButton value={value}>
      {({ copied, copy }) => (
        <Button
          color={copied ? "teal" : "blue"}
          rightSection={copied ? <IconCheck /> : <IconClipboard />}
          fullWidth
          onClick={copy}
        >
          {copied ? "Copied url" : "Copy to clipboard"}
        </Button>
      )}
    </CopyButton>
  );
};

export default CopyButton_;
