import React, { Component,useState } from 'react'
import Wallet from '../components/Wallet'
import TransactionForm from '../components/TransactionForm'
import ConfirmTransaction from '../components/ConfirmTransaction'
import Hoc from '../components/Hoc'

export default function SendTX (props) {
    const [transactionData, settransactionData] = useState({
        amount:0,
        address:"",
        fee:0.1
    })
    const [step, setStep] = useState(0)
    const nextStep = () => {
        setStep(1)
    }

    const stepBackwards = () => {
        setStep(0)
    }

    const sendTransaction = () => {
        console.log("Transaction sent")
    }
    return (
        <Hoc className="main-container">
            <Wallet />
            {
                step===0 ? 
                <TransactionForm 
                    nextStep={nextStep} 
                    transactionData={transactionData} 
                    setData={settransactionData}/>:
                <ConfirmTransaction 
                    transactionData={transactionData}
                    stepBackward={stepBackwards} 
                    sendTransaction={sendTransaction} />
            }
        </Hoc>
    )
}
