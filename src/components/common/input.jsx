import React from "react";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className="field">
      <label>{label}</label>
      <input {...rest} id={name} name={name} className="form-control" />
      {error && (
        <div className="ui error pointing top prompt label">{error}</div>
      )}
    </div>
  );
};

export default Input;
