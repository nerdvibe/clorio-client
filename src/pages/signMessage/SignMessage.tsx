import ReactTooltip from "react-tooltip";
import Hoc from "../../components/UI/Hoc";
import SignMessageForm from "../../components/forms/signMessage/SignMessageForm";

const SignMessage = () => {
  return (
    <Hoc>
      <div className="animate__animated animate__fadeIn">
        <SignMessageForm />
        <ReactTooltip multiline={true} />
      </div>
    </Hoc>
  );
};

export default SignMessage;
