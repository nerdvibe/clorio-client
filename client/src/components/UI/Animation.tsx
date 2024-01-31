import { LottieOptions, useLottie } from "lottie-react";
import { useEffect } from "react";

interface IProps {
  text?: string;
  secondaryText?: string;
  width?: string;
  animation: any;
  loop?: boolean;
  maxWidth?: string;
  timeout?: number;
}

const MissingAnimation = ({
  maxWidth,
  text,
  secondaryText,
  width,
  animation,
  loop = true,
  timeout,
}: IProps) => {
  const options = {
    animationData: animation,
    loop,
    autoplay: true,
  } as LottieOptions;

  const { View, stop } = useLottie(options, {
    width: width ? width : "80%",
    margin: "0 auto",
    maxWidth: maxWidth,
  });

  useEffect(() => {
    setTimeout(() => {
      stop();
    }, timeout || 12000);
  }, []);

  return (
    <div>
      {View}
      {text && <h5 className="full-width-align-center">{text}</h5>}
      {secondaryText && (
        <h6 className="full-width-align-center">{secondaryText}</h6>
      )}
    </div>
  );
};

export default MissingAnimation;
