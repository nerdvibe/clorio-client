import React, { useEffect } from "react";
import Footer from "../components/General/Footer";
import Hoc from "../components/Hoc";
import Homepage from "../components/Homepage";
import { clearSession } from "../tools";

export const SplashScreen = (props) => {
  useEffect(() => {
    clearSession();
  }, []);
  return (
    <Hoc>
      <Homepage />
      <Footer network={props.network} />
    </Hoc>
  );
};
