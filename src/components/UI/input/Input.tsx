import { useState } from "react";
import { IInputProps } from "./InputProps";
import { Eye, EyeOff } from "react-feather";

const Input = ({
  type,
  value,
  inputHandler,
  placeholder,
  small,
  hidden,
}: IInputProps) => {
  const [showText, setShowText] = useState<boolean>(false);

  /**
   * If hidden props is set, hide or show the input field (based on the showText status).
   * @returns string
   */
  const inputTypeHandler = () => {
    if (hidden) {
      return showText ? type : "password";
    }
    return type || "text";
  };

  return (
    <div
      className={
        small
          ? "small-wrap-input1 validate-input "
          : "wrap-input1 validate-input"
      }
      data-validate="Name is required"
    >
      <span className="icon" />
      <input
        className={`input1 ${hidden && "show-icon"}`}
        type={inputTypeHandler()}
        value={value}
        name="name"
        onChange={inputHandler}
        placeholder={placeholder}
        autoComplete="off"
        min="0"
      />
      {hidden && (
        <span
          className="show-hide-icon"
          data-tip={showText ? "Hide private key" : "Show private key"}
        >
          {!showText ? (
            <Eye onClick={() => setShowText(!showText)} />
          ) : (
            <EyeOff onClick={() => setShowText(!showText)} />
          )}
        </span>
      )}
      <span className="shadow-input1"></span>
    </div>
  );
};

export default Input;
