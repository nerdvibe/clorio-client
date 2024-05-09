import ReactTooltip from 'react-tooltip';
import Hoc from '../../components/UI/Hoc';
import SignMessageForm from '../../components/forms/signMessage/SignMessageForm';

function SignMessage() {
  return (
    <Hoc>
      <div className="animate__animated animate__fadeIn">
        <SignMessageForm />
        <ReactTooltip id="SignMessage" />
      </div>
    </Hoc>
  );
}

export default SignMessage;
