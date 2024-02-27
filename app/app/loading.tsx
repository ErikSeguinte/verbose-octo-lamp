import { Loader } from "@mantine/core";
import React from "react";

const loading = () => {
  return (
    <div className="flex justify-center">
      <Loader size="100" />
    </div>
  );
};

export default loading;
