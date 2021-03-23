import React from "react";
import { Link } from "react-router-dom";

export default function Button(props) {
  const {className,onClick,text,icon,disabled,link} = props
  const button = (
    <div
      className={className + " button"}
      onClick={onClick}
    >
      {icon}&nbsp;{text}
    </div>
  );
  const disabledButton = (
    <div className={"disabledButton margin-auto"}>
      {icon}&nbsp;{text}
    </div>
  );
  if (disabled) {
    return disabledButton;
  }
  return link ? <Link to={link}> {button} </Link> : button;
}
