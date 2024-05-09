import type { ISignature } from '../../../types/Signature';

interface IProps {
  signature: ISignature;
  publicKey: string;
  data: string;
  reset: () => void;
}

const SignMessageResult = ({ publicKey, data, signature }: IProps) => {
  const { field, scalar } = signature;
  return (
    <div className="mx-auto">
      <div className="">
        <div className="transaction-form animate__animated animate__fadeIn mb-0 mt-2 ">
          <h5 className="mb-4">
            <strong>Your signed message</strong>
          </h5>
          <div className="signed-message-container my-auto selectable-text">
            <p className="selectable-text">----- MESSAGE -----</p>
            <p className="selectable-text">{data}</p>
            <p className="selectable-text">----- PUBLIC KEY -----</p>
            <p className="selectable-text">{publicKey}</p>
            <p className="selectable-text">----- FIELD -----</p>
            <p className="selectable-text">{field}</p>
            <p className="selectable-text">----- SCALAR -----</p>
            <p className="selectable-text">{scalar}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignMessageResult;
