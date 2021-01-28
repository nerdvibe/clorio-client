import React, { Component } from 'react'
import Hoc from '../components/Hoc'
import Homepage from '../components/Homepage'

export default class SplashScreen extends Component {
    state={
        step:""
    }
    render() {
        return (
            
            <Hoc className="mx-auto">
                <Homepage />
            </Hoc>
        )
    }

}
