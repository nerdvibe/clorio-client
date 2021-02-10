import React from 'react'
import Hoc from '../components/Hoc'

export default function Modal(props) {
    return props.show ? (
        <Hoc className="mx-auto">
            <div className="modal-background " onClick={props.close} />
            <div className="modal-container">
                {props.children}
            </div>
        </Hoc>
    ):(
        <></>
    )
}
