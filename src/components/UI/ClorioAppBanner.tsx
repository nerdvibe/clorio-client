import isElectron from "is-electron";
import { useState } from "react";
import { X } from "react-feather";

export const ClorioAppBanner = () => {
  const [show, setShow] = useState(true);
  return !isElectron() && show ? (
    <div className="clorio-app-banner">
      <div>
        <div>
          <p>To enhance your security we recommend to download Clorio App.</p>
          <p>
            For more info click{" "}
            <a
              href={process.env.REACT_APP_GITHUB_RELEASE_URL}
              target="_blank"
              rel="noreferrer"
            >
              here.
            </a>
          </p>
        </div>
        <div className="close-button" onClick={() => setShow(false)}>
          <X />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
