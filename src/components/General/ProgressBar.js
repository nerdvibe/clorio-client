import React from "react";

const ProgressBar = (props) => {
  const { text, progress } = props;
  const progressColor = () => {
    if (progress > 75) {
      return "#2A9D8F";
    }
    if (progress > 25) {
      return "#E9C46A";
    }
    return "#AA0000";
  };

  const containerStyles = {
    height: 50,
    width: "90%",
    backgroundColor: "#e0e0de",
    borderRadius: 20,
    margin: 50,
  };

  const fillerStyles = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: progressColor(),
    borderRadius: "inherit",
    textAlign: "right",
    padding: 10,
    transition: "1s",
    maxWidth: "100%",
  };

  const labelStyles = {
    padding: 5,
    color: "white",
    fontWeight: "bold",
  };

  return (
    <div>
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles} className="my-auto">
            {" "}
            {text}{" "}
          </span>{" "}
        </div>{" "}
      </div>
    </div>
  );
};

export default ProgressBar;
