import React from 'react'

export default function Input(props) {
    return (
        <div className="wrap-input1 validate-input" data-validate="Name is required">
            <span className="icon" />
            <input className="input1" type={props.type || "text"} value={props.value} name="name" onChange={props.inputHandler} placeholder={props.placeholder} />
            <span className="shadow-input1"></span>
        </div>
    )
}
