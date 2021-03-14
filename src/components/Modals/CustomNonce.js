import React from "react";
import Button from "../General/Button";
import Input from "../General/Input";

export default function CustomNonce(props) {
  return (
    <div className="mx-auto">
      <h2>Insert nonce</h2>
      <div className="v-spacer" />
      <h5 className="align-center mx-auto">
        We are not able to fetch nonce, please set it manually
      </h5>
      <div className="v-spacer" />
      <Input
        type="number"
        inputHandler={(e) => props.setCustomNonce(e.target.value)}
      />
      <div className="v-spacer" />
      <Button
        className="lightGreenButton__fullMono mx-auto"
        onClick={props.proceedHandler}
        text="Proceed"
      />
    </div>
  );
}
