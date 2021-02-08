import React, { Component } from 'react'
import Footer from '../components/General/Footer'
import Hoc from '../components/Hoc'
import Homepage from '../components/Homepage'

export default class SplashScreen extends Component {
    state={
        step:""
    }
    render() {
        return (
            <Hoc >
                <Homepage />
                <Footer />
            </Hoc>
        )
    }

}
