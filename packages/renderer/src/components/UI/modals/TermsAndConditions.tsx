import Button from '../Button';
import {Check} from 'react-feather';
import Logo from '../logo/Logo';
import {ModalContainer} from './ModalContainer';
import {useNavigate} from 'react-router-dom';

export const TermsAndConditions = () => {
  const hasAcceptedTC = localStorage.getItem('terms-and-conditions');
  const navigate = useNavigate();

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
          <p>
            Welcome to ~Clorio, your gateway to the Mina Protocol currency. It&apos;s essential to
            recognize that, when using this service, you become the sole custodian of your private
            keys. With this authority comes significant responsibility – the duty to safeguard your
            keys diligently. Under no circumstances should you ever disclose your private key to
            anyone. For enhanced security, we strongly recommend using a hardware wallet.
          </p>
          <p>
            By choosing to utilize ~Clorio, you acknowledge that you are assuming full
            responsibility for any potential losses. Please note that our wallet is open source. We
            encourage you to thoroughly review the source code before employing this software and
            even consider running your infrastructure. Your feedback is invaluable – kindly report
            any issues you encounter on{' '}
            <a
              href="https://discord.gg/4GnkRqwsDK"
              target="_blank"
              rel="noreferrer"
            >
              WeStake.Club&apos;s discord
            </a>
            .
          </p>
          <p>
            When you opt for the ~Clorio Wallet, you are also agreeing to our{' '} 
            <a
              href="https://docs.clor.io/other/terms-and-conditions"
              target="_blank"
              rel="noreferrer"
            >
              terms and conditions
            </a>
            . It is crucial to understand that no party can be held liable for any software bugs or
            security concerns that may arise. Your use of this service implies your acceptance of
            these terms and your commitment to exercising due diligence in safeguarding your assets.
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
