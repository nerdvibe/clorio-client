import Button from '../Button';
import {Check} from 'react-feather';
import Logo from '../logo/Logo';
import {ModalContainer} from './ModalContainer';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

export const TermsAndConditions = () => {
  const hasAcceptedTC = localStorage.getItem('terms-and-conditions');
  const navigate = useNavigate();
  const {t} = useTranslation();

  /**
   * Store Terms and Conditions read flag
   */
  const acceptTermsAndConditions = () => {
    localStorage.setItem('terms-and-conditions', 'true');
    navigate('/');
  };

  return (
    <div className="mx-auto">
      <ModalContainer
        show={!hasAcceptedTC}
        className="big-modal-container z-100"
      >
        <Logo big={true} />
        <h2 className="align-center mx-auto">👋 Welcome to Clorio Wallet</h2>
        <hr />
        <div className="terms">
          {' '}
          <p>{t('terms_and_conditions.terms_paragraph_1')}</p>
          <p>
            {t('terms_and_conditions.terms_paragraph_2')}
            <a
              href="https://discord.gg/4GnkRqwsDK"
              target="_blank"
              rel="noreferrer"
            >
              {t('terms_and_conditions.link1')}
            </a>
            .
          </p>
          <p>
            {t('terms_and_conditions.terms_paragraph_3')}
            <a
              href="https://docs.clor.io/other/terms-and-conditions"
              target="_blank"
              rel="noreferrer"
            >
              {t('terms_and_conditions.link2')}
            </a>
            {t('terms_and_conditions.terms_paragraph_4')}
          </p>
        </div>
        <div className="v-spacer" />
        <div className="v-spacer" />
        <div className="w-50 mx-auto">
          <Button
            onClick={acceptTermsAndConditions}
            text="I agree"
            style="primary"
            icon={<Check />}
          />
        </div>
      </ModalContainer>
    </div>
  );
};
