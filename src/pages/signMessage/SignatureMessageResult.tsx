import SignMessageResult from "../../components/forms/signMessage/SignMessageResult";
import Hoc from "../../components/UI/Hoc";
import { ISignMessage } from "./SignMessageInterface";

interface IProps {
  result: ISignMessage;
  resetForm: () => void;
}

const SignatureMessageResult = ({ result, resetForm }: IProps) => (
  <Hoc>
    <div className="animate__animated animate__fadeIn">
      <SignMessageResult {...result} reset={resetForm} />
    </div>
  </Hoc>
);

export default SignatureMessageResult;
