import Hoc from "../Hoc";

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
    <Hoc className="mx-auto first-place  animate__animated animate__fadeIn modal-wrapper">
      <div className="modal-background " onClick={close} />
      <div className={`glass-card px-5 py-5 z-100 modal-bg ${className}`}>
        {children}
      </div>
    </Hoc>
  ) : (
    <></>
  );
};
