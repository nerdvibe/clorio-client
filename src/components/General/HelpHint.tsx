import { HelpCircle } from "react-feather";
import ReactTooltip from "react-tooltip";

interface IProps{
  hint:string
}

export default function HelpHint(props:IProps ) {
  const {hint} = props;
  return (
    <>
      <HelpCircle data-tip={hint} />
      <ReactTooltip multiline={true} />
    </>
  );
}
