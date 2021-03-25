import React from "react";
import { HelpCircle } from "react-feather";
import ReactTooltip from "react-tooltip";

export default function HelpHint({ hint }) {
  return (
    <>
      <HelpCircle data-tip={hint} />
      <ReactTooltip multiline={true} />
    </>
  );
}
