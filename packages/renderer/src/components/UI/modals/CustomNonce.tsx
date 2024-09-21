import Button from '../Button';
import Input from '../input/Input';
import { readSession } from '../../../tools/db';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'react-feather';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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

  const disableButton = () => {
    return isNaN(+nonce);
  };

  return (
    <div>
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1 className="mb-0">{t('custom_nonce.insert_nonce')}</h1>
          <div className="divider w-100" />
        </div>
      </div>
      <div className="">
        <p className="mx-auto">
          {t('custom_nonce.fetch_nonce_error')} <br />
          {t('custom_nonce.insert_nonce_manually')} <br />
          {t('custom_nonce.found_on_explorer')} 
          <a
            href={`${import.meta.env.VITE_REACT_APP_EXPLORER_URL}/wallet/${address}`}
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            {t('custom_nonce.here')}
          </a>
          <br />
          {t('custom_nonce.insert_zero_if_none')}
        </p>
        <div className="v-spacer" />
        <Input
          type="number"
          inputHandler={(e) => setCustomNonce(+e.target.value)}
        />
        <Button
          text={t('custom_nonce.proceed')}
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
