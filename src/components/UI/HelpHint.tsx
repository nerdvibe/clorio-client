import { HelpCircle } from "react-feather";

interface IProps {
  hint: string;
}

const HelpHint = ({ hint }: IProps) => (
  <>
    <HelpCircle data-tip={hint} />
  </>
);

export default HelpHint;
