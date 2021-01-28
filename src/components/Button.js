import React from 'react'

export default function Button(props) {
    return (
        <div className={props.className} onClick={props.onClick}>{props.text}</div>
    )
}
