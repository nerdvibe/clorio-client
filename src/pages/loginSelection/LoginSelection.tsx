import { Link } from "react-router-dom";
import { ReactComponent as UsbDrive } from "./assets/usb-drive.svg";
import { ReactComponent as FileLock } from "./assets/file-lock.svg";

const LoginSelection = () => {
  return (
    <div className="full-screen-container-center animate__animated animate__fadeIn">
      <div className="homepage-card glass-card flex flex-col flex-vertical-center">
        <div className="w-100">
          <div className="flex flex-col flex-vertical-center">
            <h1>Login</h1>
            <p className="text-center mt-1">Select a method to login</p>
            <div className="divider" />
          </div>
        </div>
        <div className="w-75 flex flex-row min-height-200">
          <div className="half-card py-3">
            <Link to={"ledger"}>
              <div className="big-icon-button">
                <UsbDrive className="big-icon" />
                <p className="mt-2">Hardware wallet</p>
              </div>
            </Link>
          </div>
          <div className="half-card py-3">
            <Link to={"login"}>
              <div className="big-icon-button">
                <FileLock className="big-icon" />
                <p className="mt-2">
                  Private key <br />
                  Passphrase
                </p>
              </div>
            </Link>
          </div>
        </div>
        <div className="w-100 mt-5">
          <Link to={"/"}>
            <p className="text-center mt-1">Go back</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;
