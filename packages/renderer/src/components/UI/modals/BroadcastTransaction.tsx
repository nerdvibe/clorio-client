import Animation from '../Animation';
import BroadcastingAnimation from './assets/broadcasting.json';
import {useTranslation} from 'react-i18next';

const INFINITE_TIMEOUT = 99999999;

export const BroadcastTransaction = () => {
  const {t} = useTranslation();

  return (
    <div>
      <div className="w-75 mx-auto ">
        <Animation
          animation={BroadcastingAnimation}
          maxWidth="700px"
          timeout={INFINITE_TIMEOUT}
        />
      </div>
      <p className="mb-0 mx-auto">
        {t('broadcast_translation.we_are_broadcasting_your_transaction_to_the_network')}
      </p>
    </div>
  );
};
