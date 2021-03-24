import React from "react";

export default function Input(props) {
  const {type,value,inputHandler,placeholder,small} = props
  return (
    <div
      className={small?"small-wrap-input1 validate-input ":"wrap-input1 validate-input"}
      data-validate="Name is required"
    >
      <span className="icon" />
      <input
        className="input1"
        type={type || "text"}
        value={value}
        name="name"
        onChange={inputHandler}
        placeholder={placeholder}
        autocomplete="off"
      />
      <span className="shadow-input1"></span>
    </div>
  );
}
