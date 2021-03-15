import React from "react";

export default function Hoc(props) {
  return (
    <div className={"animate__animated animate__fadeIn " + props.className}>
      {props.children}
    </div>
  );
}
