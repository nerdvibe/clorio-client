import { useState } from "react";
import { useEffect } from "react";
import Avatar from "../../../tools/avatar/avatar";
import { IKeypair } from "../../../types";
import Spinner from "../Spinner";

interface IProps {
  generateKeypair: () => Promise<IKeypair | undefined>;
  setKeypair: (keypair: IKeypair) => void;
  selectedKeypair?: IKeypair;
}

const AccountAvatar = ({
  generateKeypair,
  selectedKeypair,
  setKeypair: setKeypairProp,
}: IProps) => {
  const [keypair, setKeypair] = useState<any>();
  const generateKeys = async () => {
    const keypair = await generateKeypair();
    if (keypair) {
      setKeypair(keypair);
    }
  };
  useEffect(() => {
    generateKeys();
  }, []);

  const selectAccount = () => {
    setKeypairProp(keypair);
  };

  const isSelected = selectedKeypair?.publicKey === keypair?.publicKey;

  return keypair?.publicKey ? (
    <div
      onClick={selectAccount}
      className={`account-avatar-button ml-4 mr-4 cursor-pointer ${
        isSelected ? "account-avatar-selected" : ""
      }`}
    >
      <div style={{ width: "75px" }}>
        <Avatar address={keypair?.publicKey} size={50} />
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

export default AccountAvatar;
