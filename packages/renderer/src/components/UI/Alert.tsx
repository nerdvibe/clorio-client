import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {TOAST_TIMEOUT} from '../../tools';

const Alert = () => (
  <ToastContainer
    position="bottom-right"
    autoClose={TOAST_TIMEOUT}
    hideProgressBar={false}
    theme="dark"
  />
);

export default Alert;
