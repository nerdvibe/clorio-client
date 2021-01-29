import React from 'react'
import { Link } from 'react-router-dom';

export default function Button(props) {
    const button = <div className={props.className + " button"} onClick={props.onClick}>{props.icon} {props.text}</div>

    return props.link ? (
        <Link to={props.link}> {button} </Link>
    ) : button
}
