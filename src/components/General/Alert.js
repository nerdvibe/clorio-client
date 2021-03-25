import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TOAST_TIMEOUT = 5000;

const Alert = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={TOAST_TIMEOUT}
      hideProgressBar={false}
    />
  );
};

export default Alert;
