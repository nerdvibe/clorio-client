interface IProps{
  show?:boolean,
  className?:string,
  children: JSX.Element
}

const Spinner = (props:IProps) => {
  const {show,className,children} = props;
  return show ? (
    <div className={"spinner-container center " + className}>
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
    children
  );
}

export default Spinner;
