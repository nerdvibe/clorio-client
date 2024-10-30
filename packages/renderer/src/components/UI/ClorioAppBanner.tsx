import isElectron from 'is-electron';
import {useState} from 'react';
import {X} from 'react-feather';
import {useTranslation} from 'react-i18next';

export const ClorioAppBanner = () => {
  const {t} = useTranslation();
  const [show, setShow] = useState(true);
  return !isElectron() ? (
    <div
      className={`clorio-app-banner animate__animated animate__fadeInDown ${
        !show ? 'animate__fadeOutUp' : ''
      }`}
    >
      <div>
        <div>
          <p>{t('app_banner.enhance_security')}</p>
          <p>
            {t('app_banner.download_here')}{' '}
            <a
              href={import.meta.env.VITE_REACT_APP_GITHUB_RELEASE_URL}
              target="_blank"
              rel="noreferrer"
            >
              {t('app_banner.download_here')}
            </a>
          </p>
        </div>
        <div
          className="close-button"
          onClick={() => setShow(false)}
        >
          <X />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
