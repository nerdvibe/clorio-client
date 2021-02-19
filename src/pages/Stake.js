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

export default (props) => {
    const [delegateName, setdelegateName] = useState("");
    const [currentDelegate, setCurrentDelegate] = useState("");
    const [showModal, setshowModal] = useState(false)
    const validators = useQuery(VALIDATORS);
    const news = useQuery(NEWS);
    const delegate = useQuery(DELEGATE,{variables:{publicKey:props.sessionData.address}});
    
    useEffect(()=>{
        if(delegate.data && delegate.data.accountByKey.delegate){
            setCurrentDelegate(delegate.data.accountByKey.delegate.publicKey)
        }
    },[delegate.data])

    const openModal = (delegateName) => {
        setdelegateName(delegateName)
        setshowModal(true)
    }

    const toggleModal = () => {
        setshowModal(!showModal)
    }

    const confirmDelegate = () => {
        // TODO : Delegation logic
        setshowModal(!showModal)
    }

    const renderModal = () => {
        return(
            <div className="mx-auto">
                <h2>Confirm Delegation</h2>
                <div className="v-spacer"/>
                <h5 className="align-center mx-auto">Are you sure you want to <br/> 
                delegate this stake to <strong>{delegateName}</strong></h5>
                <div className="v-spacer"/>
                <Row>
                    <Col xs={6} >
                        <Button onClick={toggleModal} className="link-button" text="Cancel"/>
                    </Col>
                    <Col xs={6} >
                        <Button onClick={confirmDelegate} className="lightGreenButton__fullMono" text="Confirm" />
                    </Col>
                </Row>
            </div>
        )
    }

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
            <Modal show={showModal} close={toggleModal}>
                {renderModal()}
            </Modal>
        </Hoc>
    )
}
