import React from "react";
import LedgerConnect from "../components/LedgerLogin/LedgerConnect";

export default function LedgerLogin(props) {
  return (
    <div className="animate__animated animate__fadeIn">
      <LedgerConnect {...props} />
    </div>
  );
}
