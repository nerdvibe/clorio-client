import { Link } from "react-router-dom";

interface IProps{
  className?:string,
  onClick?:()=>void,
  text?:string,
  icon?:React.ReactNode,
  disabled?:boolean,
  link?:string
}

const Button = (props:IProps) => {
  const { className, onClick, text, icon, disabled, link } = props;
  const button = (
    <div className={className + " button"} onClick={onClick}>
      {icon}&nbsp;{text}
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
}

export default Button;
