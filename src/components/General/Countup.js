import React from "react";
import { CountUp } from "countup.js";

export default function Countup(props) {
  const { number } = props;
  let numberAnimation;
  if(number){
    numberAnimation = new CountUp("increasingNumber", number,{
      decimalPlaces:3
    });
    numberAnimation.start();
  }
  return <span id="increasingNumber" />;
}
