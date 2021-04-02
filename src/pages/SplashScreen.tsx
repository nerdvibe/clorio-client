import { useEffect } from "react";
import Footer from "../components/general/Footer";
import Hoc from "../components/general/Hoc";
import Homepage from "../components/general/Homepage";
import { INetworkData } from "../models/NetworkData";
import { clearSession } from "../tools";

interface IProps{
  network:INetworkData
}

const SplashScreen = (props:IProps) => {
  
  /**
   * If splashscreen is loaded, clear session data
   */
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

export default SplashScreen;
