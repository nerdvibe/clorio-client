import LogoImage from "./assets/logo.svg";

interface IProps {
  big?: boolean;
}

const Logo = ({ big }: IProps) => (
  <div>
    <img src={LogoImage} className={big ? "big-logo" : "logo-image"} />
  </div>
);

export default Logo;
