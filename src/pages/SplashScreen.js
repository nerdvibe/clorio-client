import React from 'react'
import Footer from '../components/General/Footer'
import Hoc from '../components/Hoc'
import Homepage from '../components/Homepage'

export const SplashScreen = () => {
    return (
        <Hoc >
            <Homepage />
            <Footer />
        </Hoc>
    )
}
