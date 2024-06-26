import {X} from 'react-feather';
import Hoc from '../Hoc';

interface IProps {
  close?: () => void;
  children: React.ReactNode;
  show: boolean;
  className?: string;
  closeOnBackgroundClick?: boolean;
}

export const ModalContainer = ({
  close,
  children,
  show,
  className = '',
  closeOnBackgroundClick = true,
}: IProps) => {
  return show ? (
    <Hoc className="mx-auto first-place  animate__animated animate__fadeIn modal-wrapper">
      <div
        className="modal-background "
        onClick={closeOnBackgroundClick ? close : () => null}
      />
      <div className={`glass-card px-5 py-5 z-100 modal-bg mx-5 ${className}`}>
        {close && (
          <div
            className="modal-close-button cursor-pointer"
            onClick={close}
          >
            {' '}
            <X />
          </div>
        )}
        {children}
      </div>
    </Hoc>
  ) : (
    <></>
  );
};
