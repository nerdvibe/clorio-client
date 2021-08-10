import { LottieOptions, useLottie } from "lottie-react";
import { useEffect } from "react";

interface IProps {
  text?: string;
  secondaryText?: string;
  width?: string;
  animation: any;
  loop?: boolean;
}

const MissingAnimation = ({
  text,
  secondaryText,
  width,
  animation,
  loop = true,
}: IProps) => {
  const options = {
    animationData: animation,
    loop,
    autoplay: true,
  } as LottieOptions;

  const { View, stop } = useLottie(options, {
    width: width ? width : "100%",
    margin: "0 auto",
  });

  useEffect(() => {
    setTimeout(() => {
      stop();
    }, 6000);
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
