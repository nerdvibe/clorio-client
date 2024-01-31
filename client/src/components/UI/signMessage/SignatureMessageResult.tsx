import SignMessageResult from "../../forms/signMessage/SignMessageResult";
import Hoc from "../Hoc";
import { ISignMessage } from "../../../pages/signMessage/SignMessageTypes";

interface IProps {
  result: ISignMessage;
  resetForm: () => void;
}

const SignatureMessageResult = ({ result, resetForm }: IProps) => (
  <Hoc>
    <div className="animate__animated animate__fadeIn glass-card">
      <SignMessageResult {...result} reset={resetForm} />
    </div>
  </Hoc>
);

export default SignatureMessageResult;
