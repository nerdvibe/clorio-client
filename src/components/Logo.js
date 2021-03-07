import React from "react";
import LogoImage from "../assets/Logo.svg";

export default function Logo(props) {
  return (
    <div>
      <img src={LogoImage} className={props.big ? "big-logo" : "logo-image"} />
    </div>
  );
}
