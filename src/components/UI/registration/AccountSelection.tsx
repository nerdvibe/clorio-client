import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import { IKeypair } from "../../../types";
import Button from "../Button";
import Spinner from "../Spinner";
import AccountAvatar from "./AccountAvatar";

interface IProps {
  generateKeypair: () => Promise<IKeypair | undefined>;
  setKeypair: (keypair: IKeypair) => void;
  selectedKeypair?: IKeypair;
  goToNext: () => void;
}

const AccountSelection = ({
  generateKeypair,
  setKeypair,
  goToNext,
  selectedKeypair,
}: IProps) => {
  const [showLoader, setShowLoader] = useState(true);
  const isNextDisabled = () => {
    return !selectedKeypair?.privateKey;
  };
  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, 1000);
  }, []);
  return (
    <div className="animate__animated animate__fadeIn glass-card py-5 px-5">
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1>Create new</h1>
          <p className="text-center mt-1">Select an avatar</p>
          <div className="divider" />
        </div>
      </div>
      <Spinner className="h-100px" show={showLoader}>
        <div className="animate__animated animate__fadeIn ">
          <div className="flex flex-row mt-4">
            <AccountAvatar
              setKeypair={setKeypair}
              generateKeypair={generateKeypair}
              key={0}
              selectedKeypair={selectedKeypair}
            />
            <AccountAvatar
              setKeypair={setKeypair}
              generateKeypair={generateKeypair}
              key={1}
              selectedKeypair={selectedKeypair}
            />
            <AccountAvatar
              setKeypair={setKeypair}
              generateKeypair={generateKeypair}
              key={2}
              selectedKeypair={selectedKeypair}
            />
            <AccountAvatar
              setKeypair={setKeypair}
              generateKeypair={generateKeypair}
              key={3}
              selectedKeypair={selectedKeypair}
            />
            <AccountAvatar
              setKeypair={setKeypair}
              generateKeypair={generateKeypair}
              key={4}
              selectedKeypair={selectedKeypair}
            />
          </div>
          <div className="flex flex-row mt-5 full-width">
            <div className="half-card py-3">
              <Button
                className="big-icon-button"
                text="Go back"
                icon={<ArrowLeft />}
                link={"/"}
              />
            </div>
            <div className="half-card py-3">
              <Button
                onClick={goToNext}
                text="Next"
                style="primary"
                icon={<ArrowRight />}
                appendIcon
                disabled={isNextDisabled()}
              />
            </div>
          </div>
        </div>
      </Spinner>
    </div>
  );
};

export default AccountSelection;
