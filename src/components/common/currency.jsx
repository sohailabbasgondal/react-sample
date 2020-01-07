import React from "react";
import auth from "../../services/authService";

const Currency = data => {
  return (
    <React.Fragment>
      {data.label}
      <span style={{ fontSize: "9px" }}>
        {" "}
        {auth.getCurrentUser().currency}{" "}
      </span>
    </React.Fragment>
  );
};

export default Currency;
