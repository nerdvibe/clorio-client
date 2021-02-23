import React, { Component,useState } from 'react'
import Wallet from '../components/Wallet'
import TransactionForm from '../components/TransactionForm'
import ConfirmTransaction from '../components/ConfirmTransaction'
import ConfirmLedgerTransaction from '../components/ConfirmLedgerTransaction'
import Hoc from '../components/Hoc'
import Alert from '../components/General/Alert'
import { getAddress } from '../tools'
import * as CodaSDK from "@o1labs/client-sdk";
import Modal from '../components/Modal'
import Input from '../components/Input'
import { Col, Row } from 'react-bootstrap'
import Button from '../components/Button'
import { useQuery, gql } from '@apollo/client';
import { useHistory } from 'react-router-dom'
import PrivateKeyModal from '../components/PrivateKeyModal'

const GET_FEE = gql`
    query GetFees {
        estimatedFee {
            average
            fast
        }
    }
`


const GET_NONCE = gql`
    query accountByKey($publicKey: String) {
        accountByKey(publicKey: $publicKey) {
            nonce
        }
    }
`



export default function SendTX (props) {
    const ModalStates = Object.freeze({
        "PASSPHRASE" : "passphrase",
        "BROADCASTING" : "broadcasting"
    })
    const [show, setShow] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [step, setStep] = useState(0)
    const [showModal, setshowModal] = useState("")
    const [address, setAddress] = useState("")
    const [transactionData, settransactionData] = useState({
        amount:0,
        address:"",
        fee:0.1,
        nonce:0
    })
    const isLedgerEnabled = false;
    const history = useHistory();
    const fee = useQuery(GET_FEE);
    const nonce = useQuery(GET_NONCE,{variables:{publicKey:address}});
    
    getAddress((address)=>{
        setAddress(address)
    })

    return (
        <Hoc className="main-container">
            <Wallet />
            {
                step===0 ? 
                <TransactionForm 
                    defaultFee={fee.data ? fee.data.estimatedFee.average : 0}
                    fastFee={fee.data ? fee.data.estimatedFee.fast : 0}
                    nextStep={openModal} 
                    transactionData={transactionData} 
                    setData={settransactionData}/>:
                    (
                        isLedgerEnabled ? 
                        <ConfirmLedgerTransaction 
                            transactionData={transactionData}
                            stepBackward={stepBackwards} 
                            sendTransaction={openModal} /> 
                        :
                        <ConfirmTransaction 
                            transactionData={transactionData}
                            stepBackward={stepBackwards} 
                            sendTransaction={sendTransaction} />
                    )
            }
            <Modal show={showModal===ModalStates.PASSPHRASE} close={closeModal}>
                <PrivateKeyModal 
                    confirmPrivateKey={confirmPrivateKey}
                    closeModal={closeModal}
                    setPrivateKey={setPrivateKey}
                />
            </Modal>
            <Modal show={showModal===ModalStates.BROADCASTING} close={closeModal}>
                {renderBroadcastingModal()}
            </Modal>
            <Alert show={show} hideToast={hideToast} type={"error-toast"}>
                {alertText}
            </Alert>
        </Hoc>
    )
    
    function renderModal () {
        return(
            <div className="mx-auto">
                <h2>Insert Private Key</h2>
                <div className="v-spacer"/>
                <h5 className="align-center mx-auto">In order to continue <br/> 
                please insert your private key</h5>
                <div className="v-spacer"/>
                <Input inputHandler={(e)=>{setPrivateKey(e.currentTarget.value)}} placeholder="Insert your private key"/>
                <div className="v-spacer"/>
                <Row>
                    <Col xs={6} >
                        <Button onClick={closeModal} className="link-button" text="Cancel"/>
                    </Col>
                    <Col xs={6} >
                        <Button onClick={confirmPrivateKey} className="lightGreenButton__fullMono" text="Confirm" />
                    </Col>
                </Row>
            </div>
        )
    }

    function renderBroadcastingModal () {
        return(
            <div className="mx-auto">
                <h2>Broadcasting your transaction</h2>
                <div className="v-spacer"/>
                <h5 className="align-center mx-auto">
                    We are broadcasting your transaction to the network
                </h5>
                <div className="v-spacer"/>
            </div>
        )
    }

    function openModal() {
        if(transactionData.address === "" || transactionData.amount === 0){
            showToast("Please insert an address and an amount")
        } else {
            setshowModal(ModalStates.PASSPHRASE)
        }
    }

    function closeModal() {
        setshowModal("")
    }

    function confirmPrivateKey() {
        if(privateKey === ""){
            showToast("Please insert a private key")
        } else {
            setshowModal("")
            setStep(1)
        }
    }
    
    function showToast(message) {
        setShow(true);
        setAlertText(message)
    };
    
    function hideToast() {
        setShow(false);
    };

    function stepBackwards() {
        setStep(0)
    }

    function sendTransaction() {
        setshowModal(ModalStates.BROADCASTING)
        if(nonce){
            const actualNonce = nonce.data.accountByKey.nonce ? parseInt(nonce.data.accountByKey.nonce) + 1 : 0
            try{
                const dataToSend = {
                    privateKey,
                    publicKey:address
                }
                const signedPayment = CodaSDK.signPayment({
                    from: address,
                    to: transactionData.address,
                    amount: transactionData.amount,
                    fee: transactionData.fee,
                    nonce: actualNonce
                }, dataToSend);
                if(signedPayment){
                    setTimeout(()=>{
                        setshowModal("");
                        history.push("/send-tx");
                    },2500)
                } 
            } catch (e){
                setshowModal("")
                showToast("Check if receiver address and/or private key are right")
                stepBackwards()
            }
        }
    }
}
