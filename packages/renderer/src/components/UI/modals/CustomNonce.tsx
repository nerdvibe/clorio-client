import Button from '../Button';
import Input from '../input/Input';
import { readSession } from '../../../tools/db';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'react-feather';

interface IProps {
  proceedHandler: () => void;
  setCustomNonce: (customNonce: number) => void;
  nonce: number;
}

export const CustomNonce = ({
  proceedHandler,
  setCustomNonce,
  nonce,
}: IProps) => {
  const [address, setAddress] = useState('');
  useEffect(() => {
    const readAndSetSession = async () => {
      const data = await readSession();
      if (data) {
        setAddress(data.address);
      }
    };
    readAndSetSession();
  });

  /**
   * Checks if the mnemonic contains 12 words
   * @returns boolean
   */
  const disableButton = () => {
    return isNaN(+nonce);
  };

  return (
    <div>
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1 className="mb-0">Insert nonce </h1>
          <div className="divider w-100" />
        </div>
      </div>
      <div className="">
        <p className="mx-auto">
          We are not able to fetch the nonce from the blockchain. <br />
          Please insert the nonce manually, which can be <br />
          found on the explorer by clicking
          <a
            href={`${import.meta.env.VITE_REACT_APP_EXPLORER_URL}/wallet/${address}`}
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            here.
          </a>
          <br />
          If the nonce is &ldquo;none&ldquo; insert 0.
        </p>
        <div className="v-spacer" />
        <Input
          type="number"
          inputHandler={(e) => setCustomNonce(+e.target.value)}
        />
        <Button
          text="Proceed"
          disabled={disableButton()}
          onClick={proceedHandler}
          style="primary"
          icon={<ArrowRight />}
          appendIcon
        />
      </div>
    </div>
  );
};
