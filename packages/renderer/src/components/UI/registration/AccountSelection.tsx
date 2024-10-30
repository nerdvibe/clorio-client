import {useEffect, useState} from 'react';
import {ArrowLeft, ArrowRight} from 'react-feather';
import type {IKeypair} from '../../../types';
import Button from '../Button';
import Spinner from '../Spinner';
import AccountAvatar from './AccountAvatar';
import {useTranslation} from 'react-i18next';

interface IProps {
  generateKeypair: () => Promise<IKeypair | undefined>;
  setKeypair: (keypair: IKeypair) => void;
  selectedKeypair?: IKeypair;
  goToNext: () => void;
}

const AccountSelection = ({generateKeypair, setKeypair, goToNext, selectedKeypair}: IProps) => {
  const {t} = useTranslation();

  const isNextDisabled = () => {
    return !selectedKeypair?.privateKey;
  };

  return (
    <div className="animate__animated animate__fadeIn glass-card ">
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1>{t('account_selection.create_new_wallet')}</h1>
          <p className="text-center mt-1">{t('account_selection.select_an_avatar')}</p>
          <div className="divider" />
        </div>
      </div>
      <div className="animate__animated animate__fadeIn ">
        <div className="flex flex-row mt-4 gap-4 sm-flex-wrap">
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
        <div className="flex flex-row mt-5 full-width sm-flex-wrap-reverse">
          <div className="half-card py-3">
            <Button
              className="big-icon-button"
              text={t('account_selection.go_back')}
              icon={<ArrowLeft />}
              link={'/'}
            />
          </div>
          <div className="half-card py-3">
            <Button
              onClick={goToNext}
              text={t('account_selection.next')}
              style="primary"
              icon={<ArrowRight />}
              appendIcon
              disabled={isNextDisabled()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSelection;
