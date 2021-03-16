import React from "react";
import { HelpCircle } from "react-feather";

export default function HelpHint({hint}) {
  return (
    <>
      <HelpCircle data-tip={hint}/>
    </>
  );
}
