import React,{useState} from 'react'
import Banner from '../components/Banner'
import StakeTable from '../components/StakeTable'
import Wallet from '../components/Wallet'
import Button from '../components/Button'
import Hoc from '../components/Hoc'
import Modal from '../components/Modal'
import {Row,Col} from 'react-bootstrap'

export default () => {
    const [delegateName, setdelegateName] = useState("");
    const [showModal, setshowModal] = useState(false)

    const openModal = (delegateName) => {
        setdelegateName(delegateName)
        setshowModal(true)
    }

    const toggleModal = () => {
        setshowModal(!showModal)
    }

    const confirmDelegate = () => {
        console.log("Delegate confirmed")
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
            <Banner />
            <StakeTable toggleModal={openModal}/>
            <Modal show={showModal} close={toggleModal}>
                {renderModal()}
            </Modal>
        </Hoc>
    )
}
