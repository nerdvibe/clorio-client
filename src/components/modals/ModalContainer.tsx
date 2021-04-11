import Hoc from "../UI/Hoc";

interface IProps {
  close?: () => void;
  children: React.ReactNode;
  show: boolean;
  className?: string;
}

export const ModalContainer = ({
  close,
  children,
  show,
  className = "",
}: IProps) => {
  return show ? (
    <Hoc className="mx-auto first-place  animate__animated animate__fadeIn">
      <div className="modal-background " onClick={close} />
      <div className={`modal-container ${className}`}>{children}</div>
    </Hoc>
  ) : (
    <></>
  );
};
