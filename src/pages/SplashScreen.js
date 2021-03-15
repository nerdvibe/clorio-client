import React, { useEffect } from "react";
import Footer from "../components/General/Footer";
import Hoc from "../components/General/Hoc";
import Homepage from "../components/General/Homepage";
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
