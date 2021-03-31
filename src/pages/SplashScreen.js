import React, { useEffect } from "react";
import Footer from "../components/general/Footer";
import Hoc from "../components/general/Hoc";
import Homepage from "../components/general/Homepage";
import { clearSession } from "../tools";

export default function SplashScreen (props) {
  useEffect(() => {
    clearSession();
  }, []);
  return (
    <Hoc>
      <div className="animate__animated animate__fadeIn">
        <Homepage />
        <Footer network={props.network} />
      </div>
    </Hoc>
  );
};
