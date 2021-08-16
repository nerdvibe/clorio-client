import { Link } from "react-router-dom";

interface IProps {
  className?: string;
  onClick?: () => void;
  text?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  link?: string;
  loading?: boolean;
  disableAnimation?: boolean;
}

const Button = ({
  className,
  onClick,
  text,
  icon,
  disabled,
  link,
  loading,
  disableAnimation,
}: IProps) => {
  const clickHandler = () => {
    if (loading) {
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  const button = (
    <div
      className={`${className} ${
        disableAnimation ? "" : " button-animation "
      }  button non-selectable-text`}
      onClick={clickHandler}
    >
      {loading ? (
        <div className="LoaderWrapper">
          <div className="LineWrapper">
            <div className="LineTop" />
          </div>
        </div>
      ) : (
        <>
          {icon}&nbsp;{text}
        </>
      )}
    </div>
  );

  const disabledButton = (
    <div className={"disabledButton margin-auto"}>
      {icon}&nbsp;{text}
    </div>
  );
  if (disabled) {
    return disabledButton;
  }
  return link ? <Link to={link}> {button} </Link> : button;
};

export default Button;
