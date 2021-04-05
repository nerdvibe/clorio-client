interface IProps {
  className?: string;
  children: React.ReactNode;
}

const Hoc = (props: IProps) => {
  const { className, children } = props;
  return <div className={" " + className}>{children}</div>;
};

export default Hoc;
