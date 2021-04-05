import LogoImage from "../../assets/Logo.svg";

interface IProps {
  big?: boolean;
}

const Logo = (props: IProps) => {
  const { big } = props;
  const className = big ? "big-logo" : "logo-image";
  return (
    <div>
      <img src={LogoImage} className={className} />
    </div>
  );
};

export default Logo;
