interface IProps {
  step?: number;
  max: number;
}

const Stepper = ({ step = 0, max }: IProps) => {
  const steps = () => {
    const stepsToRender = [];
    for (let i = 0; i < max; i++) {
      stepsToRender.push(
        <div className={`step  ${step > i ? "step-active" : ""}`} />
      );
    }
    return stepsToRender;
  };
  return <div className="stepper-container w-75">{steps()}</div>;
};

export default Stepper;
