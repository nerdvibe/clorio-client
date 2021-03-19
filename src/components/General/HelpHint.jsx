import React from "react";
import { HelpCircle } from "react-feather";
import ReactTooltip from "react-tooltip";

export default function HelpHint({hint}) {
  return (
    <>
      <ReactTooltip/>
      <HelpCircle data-tip={hint}/>
    </>
  );
}
