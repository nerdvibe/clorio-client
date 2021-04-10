import { useEffect } from "react";
import Footer from "../components/UI/Footer";
import Hoc from "../components/UI/Hoc";
import Homepage from "../components/UI/Homepage";
import { INetworkData } from "../types/NetworkData";
import { clearSession } from "../tools";

interface IProps {
  network: INetworkData;
}

const SplashScreen = (props: IProps) => {
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
