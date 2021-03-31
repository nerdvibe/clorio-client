import React from "react";
import Hoc from "../general/Hoc";

export default function ModalContainer(props) {
  const { close, children, show, className = "" } = props;
  return show ? (
    <Hoc className="mx-auto first-place  animate__animated animate__fadeIn">
      <div className="modal-background " onClick={close} />
      <div className={`modal-container ${className}`}>{children}</div>
    </Hoc>
  ) : (
    <></>
  );
}
