import React from 'react'

export default function Spinner(props) {
  return props.show ? (
    <div className="spinner-container center">
      <div className="show">
        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
      </div>
    ):props.children
}
