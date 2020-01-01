import React from "react";
import auth from "../../services/authService";
import { jsxFragment } from "@babel/types";

const Currency = data => {
  return (
    <jsxFragment>
      {data.label}
      <span style={{ fontSize: "9px" }}>
        {" "}
        {auth.getCurrentUser().currency}{" "}
      </span>
    </jsxFragment>
  );
};

export default Currency;
