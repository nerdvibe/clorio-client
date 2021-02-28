import React,{useState} from 'react'
import Banner from '../components/Banner'
import StakeTable from '../components/StakeTable'
import Wallet from '../components/Wallet'
import Button from '../components/Button'
import Hoc from '../components/Hoc'
import Modal from '../components/Modal'
import { useQuery, gql } from '@apollo/client';
import {Row,Col} from 'react-bootstrap'
import { getAddress } from '../tools'
import { useEffect } from 'react'
import * as CodaSDK from "@o1labs/client-sdk";
import PrivateKeyModal from '../components/PrivateKeyModal'
import Alert from '../components/General/Alert'

const VALIDATORS = gql`
    query validators {
        validators(limit: 10) {
            fee
            id
            image
            name
            publicKey
            website
        }
    }
`

const DELEGATE = gql`
    query accountByKey($publicKey: String) {
        accountByKey(publicKey: $publicKey) {
            delegate {
                publicKey
            }
        }
    }
`

const NEWS = gql`
    query NewsValidators {
        news_validators(order_by: {created_at: desc}, limit: 1) {
            title
            subtitle
            link
            cta
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
const GET_FEE = gql`
    query GetFees {
        estimatedFee {
            average
        }
    }
`

export default (props) => {
    const ModalStates = Object.freeze({
        "PASSPHRASE" : "passphrase",
        "CONFIRM_DELEGATION" : "confirm"
    })
    const [delegateData, setDelegate] = useState({});
    const [currentDelegate, setCurrentDelegate] = useState("");
    const [showModal, setshowModal] = useState("")
    const [address, setAddress] = useState("")
    const [privateKey, setPrivateKey] = useState("")
    const [showAlert, setShowAlert] = useState(false);
    const validators = useQuery(VALIDATORS);
    const fee = useQuery(GET_FEE);
    const news = useQuery(NEWS);
    const delegate = useQuery(DELEGATE,{variables:{publicKey:props.sessionData.address}});
    const nonce = useQuery(GET_NONCE,{variables:{publicKey:address}});
    
    useEffect(()=>{
        if(delegate.data && delegate.data.accountByKey && delegate.data.accountByKey.delegate){
            setCurrentDelegate(delegate.data.accountByKey.delegate.publicKey)
        }
    },[delegate.data])

    getAddress((address)=>{
        setAddress(address)
    })

    return (
        <Hoc className="main-container">
            <Wallet />
            {news.data && 
                <Banner 
                    title={news.data.news_validators[0].title} 
                    subtitle={news.data.news_validators[0].subtitle} 
                    link={news.data.news_validators[0].link}
                    cta={news.data.news_validators[0].cta}
                    />
            }
            <StakeTable toggleModal={openModal} validators={validators} currentDelegate={currentDelegate} />
            <Modal show={showModal===ModalStates.CONFIRM_DELEGATION} close={closeModal}>
                {renderModal()}
            </Modal>
            <Modal show={showModal===ModalStates.PASSPHRASE} close={closeModal}>
                <PrivateKeyModal
                    confirmPrivateKey={signStakeDelegate}
                    closeModal={closeModal}
                    setPrivateKey={setPrivateKey}
                />
            </Modal>
            <Alert show={showAlert} hideToast={()=>setShowAlert(false)} type={"error-toast"}>
                There was an error processing your delegation, please try again later.
            </Alert>
        </Hoc>
    ) 

    function signStakeDelegate(){
        try{
            const actualNonce = nonce.data.accountByKey.nonce ? parseInt(nonce.data.accountByKey.nonce) + 1 : 0
            const keypair = {
                privateKey:privateKey,
                publicKey:address
            }
            const stakeDelegation={
                to: delegateData.publicKey,
                from: address, 
                fee: fee.data.estimatedFee.average,
                nonce: actualNonce, 
            }
            const signStake = CodaSDK.signStakeDelegation(stakeDelegation,keypair)
            setshowModal("")
        }catch(e){
            setShowAlert(true)
        }
    }

    function openModal(delegate) {
        setDelegate(delegate)
        setshowModal(ModalStates.CONFIRM_DELEGATION)
    }

    function closeModal(){
        setshowModal("")
    }

    function confirmDelegate(){
        setshowModal(ModalStates.PASSPHRASE)
    }
    
    

    function renderModal(){
        return(
            <div className="mx-auto">
                <h2>Confirm Delegation</h2>
                <div className="v-spacer"/>
                <h5 className="align-center mx-auto">Are you sure you want to <br/> 
                delegate this stake to <strong>{delegateData.name}</strong></h5>
                <div className="v-spacer"/>
                <Row>
                    <Col xs={6} >
                        <Button onClick={closeModal} className="link-button" text="Cancel"/>
                    </Col>
                    <Col xs={6} >
                        <Button onClick={confirmDelegate} className="lightGreenButton__fullMono" text="Confirm" />
                    </Col>
                </Row>
            </div>
        )
    }
}
