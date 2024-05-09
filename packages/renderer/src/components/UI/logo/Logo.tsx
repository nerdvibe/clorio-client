import LogoImage from './assets/logo-white.svg';

interface IProps {
  big?: boolean;
  huge?: boolean;
}

const Logo = ({ big, huge }: IProps) => (
  <div>
    <img
      src={LogoImage}
      className={huge ? 'huge-logo' : big ? 'big-logo' : 'logo-image'}
    />
  </div>
);

export default Logo;
