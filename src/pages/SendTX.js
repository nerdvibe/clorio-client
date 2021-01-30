import React, { Component } from 'react'
import Wallet from '../components/Wallet'
import Form from '../components/Form'
import ConfirmTransaction from '../components/ConfirmTransaction'
import Hoc from '../components/Hoc'

export default class SendTX extends Component {
    state={
        step:0
    }
    render() {
        return (
            <Hoc className="main-container">
                <Wallet />
                {
                    this.state.step===0 ? 
                    <Form nextStep={this.nextStep}/>:
                    <ConfirmTransaction 
                        stepBackward={this.stepBackward} 
                        sendTransaction={this.sendTransaction} />
                }
            </Hoc>
        )
    }

    nextStep = () => {
        this.setState({step:1})
    }

    stepBackwards = () => {
        this.setState({step:0})
    }

    sendTransaction = () => {
        console.log("Transaction sent")
    }
}
