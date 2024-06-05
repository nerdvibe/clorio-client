import {HelpCircle} from 'react-feather';
import ReactTooltip from 'react-tooltip';

interface IProps {
  hint: string;
}

const HelpHint = ({hint}: IProps) => (
  <>
    <ReactTooltip />
    <HelpCircle data-tip={hint} />
  </>
);

export default HelpHint;
