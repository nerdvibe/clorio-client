import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TOAST_TIMEOUT } from "../../tools";

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
