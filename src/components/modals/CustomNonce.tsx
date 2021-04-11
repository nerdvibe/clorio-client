import Button from "../UI/Button";
import Input from "../UI/input/Input";

interface IProps {
  proceedHandler: () => void;
  setCustomNonce: (customNonce: number) => void;
}

export const CustomNonce = ({ proceedHandler, setCustomNonce }: IProps) => (
  <div className="mx-auto">
    <h2>Insert nonce</h2>
    <div className="v-spacer" />
    <div className="half-width-block">
      <h5 className="align-center mx-auto">
        We are not able to the fetch nonce, please set it manually
      </h5>
      <div className="v-spacer" />
      <Input
        type="number"
        inputHandler={e => setCustomNonce(+e.target.value)}
      />
      <div className="v-spacer" />
      <Button
        className="lightGreenButton__fullMono mx-auto"
        onClick={proceedHandler}
        text="Proceed"
      />
    </div>
  </div>
);
