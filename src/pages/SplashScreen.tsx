import { useEffect } from "react";
import Hoc from "../components/UI/Hoc";
import Homepage from "../components/UI/Homepage";
import { clearSession } from "../tools";

const SplashScreen = () => {
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
      </div>
    </Hoc>
  );
};

export default SplashScreen;
