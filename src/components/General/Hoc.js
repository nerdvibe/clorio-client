import React from "react";

export default function Hoc(props) {
  return <div className={" " + props.className}>{props.children}</div>;
}
