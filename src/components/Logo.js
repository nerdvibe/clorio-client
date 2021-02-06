import React from 'react'
import Logo from "../assets/Logo.svg";

export default (props) => {
  return (
    <div>
      <img src={Logo} className={props.big?"big-logo":"logo-image"}/>
    </div>
  )
}
