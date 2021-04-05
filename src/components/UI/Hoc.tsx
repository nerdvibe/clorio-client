interface IProps {
  className?: string;
  children: React.ReactNode;
}

const Hoc = ({ className, children }: IProps) => (
  <div className={" " + className}>{children}</div>
);

export default Hoc;
