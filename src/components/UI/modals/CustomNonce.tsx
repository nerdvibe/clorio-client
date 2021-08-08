import Button from "../Button";
import Input from "../input/Input";
import { readSession } from "../../../tools/db";
import { useEffect, useState } from "react";

interface IProps {
  proceedHandler: () => void;
  setCustomNonce: (customNonce: number) => void;
}

export const CustomNonce = ({ proceedHandler, setCustomNonce }: IProps) => {
  const [address, setAddress] = useState("");
  useEffect(() => {
    const readAndSetSession = async () => {
      const data = await readSession();
      if (data) {
        setAddress(data.address);
      }
    };
    readAndSetSession();
  });

  return (
    <div className="mx-auto">
      <h2>Insert nonce</h2>
      <div className="v-spacer" />
      <div className="">
        <h5 className="align-center mx-auto">
          We are not able to fetch the nonce from the blockchain. <br />
          Please insert the nonce manually, which can be <br />
          found on the explorer by clicking
          <a
            href={`${process.env.REACT_APP_EXPLORER_URL}/wallet/${address}`}
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            here.
          </a>
          <br />
          If the nonce is &ldquo;none&ldquo; insert 0.
        </h5>
        <div className="v-spacer" />
        <Input
          type="number"
          inputHandler={(e) => setCustomNonce(+e.target.value)}
        />
        <div className="v-spacer" />
        <Button
          className="lightGreenButton__fullMono mx-auto"
          onClick={proceedHandler}
          text="Proceed"
        />
      </div>
    </div>
  );
};
