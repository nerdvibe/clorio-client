interface IProps {
  show?: boolean;
  className?: string;
  children?: JSX.Element;
  fullscreen?: boolean;
}

const Spinner = ({ show, className, children, fullscreen = true }: IProps) => {
  return show ? (
    <div
      className={`spinner-container center ${
        fullscreen ? "no-max-height" : ""
      } ${className ? className : ""}`}
    >
      <div className="show">
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  ) : (
    children || <></>
  );
};

export default Spinner;
