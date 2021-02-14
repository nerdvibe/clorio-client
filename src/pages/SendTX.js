import React, { Component,useState } from 'react'
import Wallet from '../components/Wallet'
import TransactionForm from '../components/TransactionForm'
import ConfirmTransaction from '../components/ConfirmTransaction'
import ConfirmLedgerTransaction from '../components/ConfirmLedgerTransaction'
import Hoc from '../components/Hoc'
import Alert from '../components/General/Alert'

export default function SendTX (props) {
    const [show, setShow] = useState(false);
    const [alertText, setAlertText] = useState("");
    
    const showToast = () => {
        setShow(true);
        setAlertText("This is a test")
    };
    
    const hideToast = () => {
        setShow(false);
    };
    const isLedgerEnabled = false;
    const [transactionData, settransactionData] = useState({
        amount:0,
        address:"",
        fee:0.1
    })
    const [step, setStep] = useState(0)
    const nextStep = () => {
        if(transactionData.address === "" || transactionData.amount === 0){
            showToast()
        } else {
            setStep(1)
        }
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
                    (
                        isLedgerEnabled ? 
                        <ConfirmLedgerTransaction 
                            transactionData={transactionData}
                            stepBackward={stepBackwards} 
                            sendTransaction={sendTransaction} /> 
                        :
                        <ConfirmTransaction 
                            transactionData={transactionData}
                            stepBackward={stepBackwards} 
                            sendTransaction={sendTransaction} />
                    )
            }

            <Alert show={show} hideToast={hideToast} type={"error-toast"}>
                Please insert a valid address and an amount
            </Alert>
        </Hoc>
    )
}
