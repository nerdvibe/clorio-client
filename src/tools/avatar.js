const BigNumber = require('bignumber.js')
const React = require('react')
const sha256 = require('js-sha256')
//import styles from './accountVisual.css'

const Rect = props => <rect {...props} />
const Circle = props => <circle {...props} />
const Polygon = props => <polygon {...props} />

const colors = [
  "#F4A261",
  "#2A9D8F",
  "#264653",
  "#E9C46A",
  "#F4A261",
  "#2A9D8F",
  "#264653",
  "#E9C46A",
  "#F4A261",
  "#2A9D8F",
  "#264653",
  "#E9C46A",
  "#F4A261",
  "#2A9D8F",
  "#264653",
  "#E9C46A",
]

const computeTriangle = props => ({
  points: [
    {
      x: props.x,
      y: props.y
    },
    {
      x: props.x + props.size,
      y: props.y + props.size / 4
    },
    {
      x: props.x + props.size / 4,
      y: props.y + props.size
    }
  ]
    .map(({ x, y }) => `${x},${y}`)
    .join(' ')
})

const computePentagon = props => ({
  points: [
    {
      x: props.x + props.size / 2,
      y: props.y
    },
    {
      x: props.x + props.size,
      y: props.y + props.size / 2.5
    },
    {
      x: props.x + (props.size - props.size / 5),
      y: props.y + props.size
    },
    {
      x: props.x + props.size / 5,
      y: props.y + props.size
    },
    {
      x: props.x,
      y: props.y + props.size / 2.5
    }
  ]
    .map(({ x, y }) => `${x},${y}`)
    .join(' ')
})

const getShape = (chunk, size, gradient, sizeScale = 1) => {
  const shapeNames = ['circle', 'triangle', 'square']

  const sizes = [1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1].map(
    x => x * size * sizeScale
  )

  const coordinates = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
    x => x * (size / 40)
  )

  const shapes = {
    circle: {
      component: Circle,
      props: {
        cx: coordinates[chunk[1]] + sizes[chunk[3]] / 2,
        cy: coordinates[chunk[2]] + sizes[chunk[3]] / 2,
        r: sizes[chunk[3]] / 2
      }
    },
    square: {
      component: Circle,
      props: {
        cx: coordinates[chunk[1]] + sizes[chunk[3]] / 2,
        cy: coordinates[chunk[2]] + sizes[chunk[3]] / 2,
        r: sizes[chunk[3]] / 2
      }
    },
    rect: {
      component: Circle,
      props: {
        cx: coordinates[chunk[1]] + sizes[chunk[3]] / 2,
        cy: coordinates[chunk[2]] + sizes[chunk[3]] / 2,
        r: sizes[chunk[3]] / 2
      }
    },
    triangle: {
      component: Circle,
      props: {
        cx: coordinates[chunk[1]] + sizes[chunk[3]] / 2,
        cy: coordinates[chunk[2]] + sizes[chunk[3]] / 2,
        r: sizes[chunk[3]] / 2
      }
    },
    pentagon: {
      component: Circle,
      props: {
        cx: coordinates[chunk[1]] + sizes[chunk[3]] / 2,
        cy: coordinates[chunk[2]] + sizes[chunk[3]] / 2,
        r: sizes[chunk[3]] / 2
      }
    }
  }

  return {
    component:
      shapes[shapeNames[chunk.substr(0, 2) % shapeNames.length]].component,
    props: {
      ...shapes[shapeNames[chunk.substr(0, 2) % shapeNames.length]].props,
      fill: gradient,
      transform: `rotate(${chunk.substr(1, 2) * 3.6}, ${size / 2}, ${size / 2})`
    }
  }
}

const getBackgroundCircle = (size, gradient) => ({
  component: Circle,
  props: {
    cx: size / 2,
    cy: size / 2,
    r: size / 2,
    fill: gradient
  }
})

const getHashChunks = address => {
  const addressHash = new BigNumber(`0x${sha256(address)}`).toString().substr(3)
  return addressHash.match(/\d{5}/g)
}

export default class Avatar extends React.Component {
  shouldComponentUpdate(nextProps, state) {
    return nextProps.address !== this.props.address
  }

  render() {
    const { address, size, sizeS, className } = this.props
    const sizeL = size || 200
    const newSize = sizeL

    const addressHashChunks = getHashChunks(address)
    const gradientScheme =
    colors[
      addressHashChunks[0].substr(1, 2) % colors.length
    ]
    const gradientScheme2 =
    colors[
      addressHashChunks[0].substr(1, 2) % colors.length
    ]
    const primaryGradients = gradientScheme
    const secondaryGradients = gradientScheme2
    const shapes = [
      getBackgroundCircle(newSize, primaryGradients),
      getShape(addressHashChunks[1], newSize, primaryGradients, 1),
      getShape(addressHashChunks[2], newSize, secondaryGradients, 0.23),
      getShape(addressHashChunks[3], newSize, secondaryGradients, 0.18)
    ]
    return (
      <svg
        height={newSize}
        width={newSize}
        className={`accountVisual`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="40" cy="40" r="40" fill="#F4A261" />
        {shapes.map((shape, i) => <shape.component {...shape.props} key={i} />)}
      </svg>
    )
  }
}