import SignMessageResult from "../../components/forms/sign-message/SignMessageResult";
import Hoc from "../../components/general/Hoc";
import { ISignMessage } from "./sign-message-type";

interface IProps{
  result:ISignMessage,
  resetForm:()=>void
}

const SignatureMessageResult = (props:IProps) => {
  const {result,resetForm} = props;

  return (
    <Hoc>
      <div className="animate__animated animate__fadeIn">
        <SignMessageResult
          {...result}
          reset={resetForm}
          />
      </div>
    </Hoc>
  )
}

export default SignatureMessageResult;
