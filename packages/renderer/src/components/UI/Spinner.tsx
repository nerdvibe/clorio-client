import {useEffect, useState} from 'react';
import {PropagateLoader} from 'react-spinners';

interface IProps {
  show?: boolean;
  className?: string;
  children?: JSX.Element;
  fullscreen?: boolean;
}

const Spinner = ({show, className, children, fullscreen = true}: IProps) => {
  const [deelayedShow, setDeelayedShow] = useState(show);
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setDeelayedShow(false);
      }, 500);
    }
  }, [show]);
  return deelayedShow ? (
    <div
      className={`spinner-container center animate__animated animate__fadeIn ${
        fullscreen ? 'no-max-height' : ''
      } ${className ? className : ''}`}
    >
      <PropagateLoader
        color="#9e8cff"
        className="show"
      />
      {/* <div className="show">
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
      </div> */}
    </div>
  ) : (
    <div className="animate__animated animate__fadeIn">{children || <></>}</div>
  );
};

export default Spinner;
