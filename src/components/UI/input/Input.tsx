import { IInputProps } from "./InputProps";

const Input = ({
  type,
  value,
  inputHandler,
  placeholder,
  small,
}: IInputProps) => {
  return (
    <div
      className={
        small
          ? "small-wrap-input1 validate-input "
          : "wrap-input1 validate-input"
      }
      data-validate="Name is required">
      <span className="icon" />
      <input
        className="input1"
        type={type || "text"}
        value={value}
        name="name"
        onChange={inputHandler}
        placeholder={placeholder}
        autoComplete="off"
      />
      <span className="shadow-input1"></span>
    </div>
  );
};

export default Input;
