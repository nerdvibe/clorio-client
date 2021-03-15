import React from "react";
import Hoc from "../General/Hoc";

export default function ModalContainer(props) {
  return props.show ? (
    <Hoc className="mx-auto first-place">
      <div className="modal-background " onClick={props.close} />
      <div className="modal-container">{props.children}</div>
    </Hoc>
  ) : (
    <></>
  );
}
