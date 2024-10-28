import {Link} from 'react-router-dom';
import Footer from './Footer';
import Logo from './logo/Logo';
import {useTranslation} from 'react-i18next';

const Homepage = () => {
  const {t} = useTranslation();

  return (
    <div className="full-screen-container-center">
      <div className="homepage-card glass-card flex md-flex-col">
        <div className="half-card hero-banner">
          <div className="flex flex-col">
            <Logo big />
            <p className="text-center mt-3">{t('homepage.access_power')}</p>
          </div>
        </div>
        <div className="half-card flex flex-col hero-buttons">
          <Link to={'register'}>
            <div className="button primary">
              <span className="button-helper"></span>
              {t('homepage.create_wallet')}
            </div>
          </Link>
          <p className="w-100 text-center mt-4 mb-4">{t('homepage.or')}</p>
          <Link to={'/login-selection'}>
            <div className="button primary">
              <span className="button-helper"></span>
              {t('homepage.login')}
            </div>
          </Link>
        </div>
        <div className="mt-4 footer-container">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
