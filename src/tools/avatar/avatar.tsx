// @ts-nocheck
// Types to be defined
import BigNumber from "bignumber.js";
import React from "react";
import sha256 from "js-sha256";
import colors from "./colors.json";
import coordinates from "./coordinates.json";

const Circle = (props: any) => <circle {...props} />;

const getShape = (
  chunk: any,
  size: any,
  gradient: any,
  sizeScale = 1,
  boxSize: any
) => {
  const sizes = [1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1].map(
    (x) => x * size * sizeScale
  );

  let coord = [];
  if (boxSize <= 80) {
    coord = coordinates.small;
  } else {
    coord = coordinates.medium;
  }

  return {
    component: Circle,
    props: {
      cx: coord[chunk[1]] + sizes[chunk[3]] / 2,
      cy: coord[chunk[2]] + sizes[chunk[3]] / 2,
      r: sizes[chunk[3]] / 2,
      fill: gradient,
    },
    transform: `rotate(${chunk.substr(1, 2) * 3.6}, ${size / 2}, ${size / 2})`,
  };
};

const getBackgroundCircle = (size: any, gradient: any) => ({
  component: Circle,
  props: {
    cx: size / 2,
    cy: size / 2,
    r: size / 2,
    fill: gradient,
  },
});

const getHashChunks = (address: any) => {
  const addressHash = new BigNumber(`0x${sha256(address)}`)
    .toString()
    .substr(3);
  return addressHash.match(/\d{5}/g);
};

export default class Avatar extends React.Component<any> {
  shouldComponentUpdate(nextProps: any) {
    return nextProps.address !== this.props.address;
  }

  render() {
    const { address, size } = this.props;
    const sizeL = size || 200;
    const newSize = sizeL;

    const addressHashChunks = getHashChunks(address);
    const color1 = colors[addressHashChunks[0].substr(1, 2) % colors.length];
    const color2 = colors[addressHashChunks[1].substr(1, 2) % colors.length];
    const color3 = colors[addressHashChunks[2].substr(1, 2) % colors.length];
    const color4 = colors[addressHashChunks[3].substr(1, 2) % colors.length];
    const shapes = [
      getBackgroundCircle(newSize, color4),
      getShape(addressHashChunks[1], newSize, color1, 1),
      getShape(
        addressHashChunks[2],
        newSize,
        color2,
        addressHashChunks[6] / 200000
      ),
      getShape(
        addressHashChunks[3],
        newSize,
        color3,
        addressHashChunks[7] / 200000
      ),
      // getShape(addressHashChunks[3], newSize, color5, (addressHashChunks[8] / 200000)),
      // getShape(addressHashChunks[3], newSize, color6, (addressHashChunks[9] / 200000))
    ];
    return (
      <svg
        viewBox={`0 0 80 80`}
        className={`accountVisual + ${this.props.className}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          borderRadius: "50%",
        }}
      >
        <circle cx="40" cy="40" r="40" fill="#F4A261" />{" "}
        {shapes.map((shape, i) => (
          <shape.component {...shape.props} key={i} />
        ))}{" "}
      </svg>
    );
  }
}
