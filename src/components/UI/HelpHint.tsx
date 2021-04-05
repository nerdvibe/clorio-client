import { HelpCircle } from "react-feather";
import ReactTooltip from "react-tooltip";

interface IProps {
  hint: string;
}

const HelpHint = ({ hint }: IProps) => {
  return (
    <>
      <HelpCircle data-tip={hint} />
      <ReactTooltip multiline={true} />
    </>
  );
};

export default HelpHint;
