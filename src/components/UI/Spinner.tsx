interface IProps {
  show?: boolean;
  className?: string;
  children?: JSX.Element;
}

const Spinner = ({ show, className, children }: IProps) => {
  return show ? (
    <div className={"spinner-container center no-max-height " + className}>
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
